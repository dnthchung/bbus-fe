'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { address, type Province, type District, type Ward } from '@/helpers/address'
import { trimValue, isValidPhoneNumber, isValidEmail, isNotEmpty, validateInput } from '@/helpers/validations'
import { Upload, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUsers } from '../../context/users-context'

// Định nghĩa các định dạng file ảnh được chấp nhận
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MIN_DOB = '1950-01-01'
const MAX_DOB = new Date().toISOString().split('T')[0]

/**
 * Chuyển message backend (EN) sang tiếng Việt.
 * Ví dụ:
 *  - "User with this phone: 0949602355 already exists"
 *  → "Số điện thoại 0949602355 đã tồn tại"
 */
function parseUserCreationError(message: string): string {
  // backend có thể trả về nhiều lỗi nối bằng dấu phẩy
  const parts = message.split(',').map((p) => p.trim())
  const friendlyParts = parts.map((part) => {
    let m
    // check phone
    m = part.match(/phone:\s*(\d+)/i)
    if (m) {
      return `Số điện thoại ${m[1]} đã tồn tại`
    }
    // check email
    m = part.match(/email:\s*([^\s]+)/i)
    if (m) {
      return `Email ${m[1]} đã tồn tại`
    }
    // nếu còn trường khác, giữ nguyên (hoặc bạn có thể thêm case)
    return part
  })
  return friendlyParts.join('. ')
}

// Schema cho việc thêm mới người dùng
const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ và tên')
    .transform((value, ctx) => {
      const trimmed = trimValue(value)
      if (!isNotEmpty(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập họ và tên',
        })
        return value
      }
      const nameError = validateInput(trimmed, [(val) => /^[A-Za-zÀ-ỹ\s]+$/u.test(val)], ['Họ và tên chỉ được chứa chữ cái và khoảng trắng'])
      if (nameError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: nameError,
        })
        return value
      }
      return trimmed
    }),

  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .transform((value, ctx) => {
      const trimmed = trimValue(value)
      if (!isNotEmpty(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập email',
        })
        return value
      }
      if (!isValidEmail(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email không hợp lệ',
        })
        return value
      }
      return trimmed
    }),

  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .transform((value, ctx) => {
      const trimmed = trimValue(value)
      if (!isNotEmpty(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập số điện thoại',
        })
        return value
      }
      if (!isValidPhoneNumber(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0',
        })
        return value
      }
      return trimmed
    }),

  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  specificAddress: z
    .string()
    .min(1, 'Vui lòng nhập địa chỉ cụ thể')
    .transform((value, ctx) => {
      const trimmed = trimValue(value)
      if (!isNotEmpty(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập địa chỉ cụ thể',
        })
        return value
      }
      return trimmed
    }),
  address: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dob: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z.date({ required_error: 'Ngày sinh không được để trống', invalid_type_error: 'Ngày sinh không hợp lệ' }).refine(
      (d) => {
        const min = new Date(MIN_DOB)
        const max = new Date(MAX_DOB)
        return d >= min && d <= max
      },
      { message: `Ngày sinh phải từ ${MIN_DOB} đến ${MAX_DOB}` }
    )
  ),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  avatar: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), 'Kích thước file không được vượt quá 5MB')
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif'),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Hàm tạo username tự động bằng uuid
const generateUsername = (): string => uuidv4()

// Hàm tạo password tự động với độ dài ngẫu nhiên từ 8 đến 36 ký tự
const generatePassword = (): string => {
  const length = Math.floor(Math.random() * (36 - 8 + 1)) + 8
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const allChars = uppercase + lowercase + digits
  let password = ''

  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += digits[Math.floor(Math.random() * digits.length)]

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')

  console.log('Generated password:', password) // Log password to console for debugging

  return password
}

// Đường dẫn đến ảnh avatar mặc định
const DEFAULT_AVATAR_PATH = '/images/defaultAvatar.png'

// Hàm xử lý input để ngăn khoảng trắng đầu dòng
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
  const newValue = e.target.value.replace(/^\s+/, '')
  e.target.value = newValue // Trim ngay khi nhập
  onChange(e)
}

export function UsersAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const { refreshUsers } = useUsers()

  useEffect(() => {
    try {
      const role = localStorage.getItem('role')
      setCurrentUserRole(role || null)
    } catch (error) {
      console.error('Error reading user role from localStorage:', error)
    }
  }, [])

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      specificAddress: '',
      address: '',
      gender: 'MALE',
      dob: undefined,
      role: '',
    },
    mode: 'onBlur',
  })

  const { control, handleSubmit, reset, watch, setValue, formState, trigger } = form

  const provinceValue = watch('province')
  const districtValue = watch('district')
  const wardValue = watch('ward')
  const specificAddressValue = watch('specificAddress')

  useEffect(() => {
    if (provinceValue) {
      const province = address.find((p) => p.Id === provinceValue)
      setSelectedProvince(province || null)
      setDistricts(province?.Districts || [])
      setValue('district', '')
      setValue('ward', '')
      setWards([])
    }
  }, [provinceValue, setValue])

  useEffect(() => {
    if (districtValue && selectedProvince) {
      const district = selectedProvince.Districts?.find((d) => d.Id === districtValue)
      setSelectedDistrict(district || null)
      setWards(district?.Wards || [])
      setValue('ward', '')
    }
  }, [districtValue, selectedProvince, setValue])

  useEffect(() => {
    if (provinceValue && districtValue && wardValue && specificAddressValue) {
      const provinceName = address.find((p) => p.Id === provinceValue)?.Name || ''
      const districtName = districts.find((d) => d.Id === districtValue)?.Name || ''
      const wardName = wards.find((w) => w.Id === wardValue)?.Name || ''
      const fullAddress = `${trimValue(specificAddressValue)}, ${wardName}, ${districtName}, ${provinceName}`
      setValue('address', fullAddress)
    }
  }, [provinceValue, districtValue, wardValue, specificAddressValue, districts, wards, setValue])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Định dạng file không hợp lệ',
          description: 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif',
          variant: 'destructive',
        })
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'Kích thước file quá lớn',
          description: 'Kích thước file không được vượt quá 5MB',
          variant: 'deny',
        })
        return
      }

      setValue('avatar', file)
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setValue('avatar', undefined)
    setAvatarPreview(null)
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const validateAllFields = async () => {
    const isValid = await trigger()
    if (!isValid) {
      toast({
        title: 'Thông tin không hợp lệ',
        description: 'Vui lòng kiểm tra lại thông tin nhập vào',
        variant: 'deny',
      })
      return false
    }
    return true
  }

  const onSubmit = async (values: UserForm) => {
    try {
      const isValid = await validateAllFields()
      if (!isValid) return

      setIsSubmitting(true)

      const formData = new FormData()

      formData.append('username', generateUsername())
      formData.append('password', generatePassword())
      formData.append('email', trimValue(values.email))
      formData.append('phone', trimValue(values.phone))
      formData.append('name', trimValue(values.name))
      formData.append('address', values.address || '')
      formData.append('gender', values.gender)
      formData.append('dob', values.dob.toISOString())
      formData.append('role', values.role)

      if (values.avatar instanceof File) {
        formData.append('avatar', values.avatar)
      } else {
        try {
          const response = await fetch(DEFAULT_AVATAR_PATH)
          const blob = await response.blob()
          const defaultAvatarFile = new File([blob], 'defaultAvatar.png', { type: blob.type })
          formData.append('avatar', defaultAvatarFile)
        } catch (error) {
          console.error('Lỗi khi tải avatar mặc định:', error)
          formData.append('avatarPath', DEFAULT_AVATAR_PATH)
        }
      }

      await API_SERVICES.users.addOne(formData)

      await refreshUsers()

      toast({
        title: 'Thêm người dùng thành công',
        description: 'Người dùng mới đã được thêm vào hệ thống',
        variant: 'success',
      })

      reset()
      setAvatarPreview(null)
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Lỗi khi thêm người dùng:', error?.message)
      const errorMessage = parseUserCreationError(error?.message || '')
      toast({
        title: 'Không thể thêm người dùng',
        description: 'Đã xảy ra lỗi khi thêm người dùng mới. ' + errorMessage,
        variant: 'deny',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          reset()
          setAvatarPreview(null)
          setSelectedProvince(null)
          setSelectedDistrict(null)
          setDistricts([])
          setWards([])
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-w-5xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>Tạo người dùng mới.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='user-form' onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3 flex flex-col items-center space-y-2'>
                <div className='relative'>
                  <Avatar className='h-32 w-32'>
                    {avatarPreview ? <AvatarImage src={avatarPreview} alt='Avatar preview' /> : <AvatarImage src={DEFAULT_AVATAR_PATH} alt='Default avatar' />}
                    <AvatarFallback>
                      <span className='text-2xl'>👤</span>
                    </AvatarFallback>
                  </Avatar>
                  {avatarPreview && (
                    <Button type='button' variant='destructive' size='icon' className='absolute -right-2 -top-2 h-6 w-6 rounded-full' onClick={handleRemoveAvatar}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='flex items-center'>
                  <label htmlFor='avatar-upload' className='flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                    <Upload className='mr-2 h-4 w-4' />
                    Tải ảnh lên
                  </label>
                  <input id='avatar-upload' type='file' accept='image/*' className='hidden' onChange={handleAvatarChange} />
                </div>
                {formState.errors.avatar && <p className='text-sm text-destructive'>{formState.errors.avatar.message as string}</p>}
              </div>

              <div className='col-span-9 grid grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nguyễn Quang Lợi'
                          autoComplete='off'
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                          onBlur={() => {
                            field.onBlur()
                            setValue('name', trimValue(field.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='loinq@gmail.com'
                          autoComplete='off'
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                          onBlur={() => {
                            field.onBlur()
                            setValue('email', trimValue(field.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0912345000'
                          autoComplete='off'
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                          onBlur={() => {
                            field.onBlur()
                            setValue('phone', trimValue(field.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='dob'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        {/* <Input
                          type='date'
                          min='1900-01-01'
                          max={new Date().toISOString().split('T')[0]}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            field.onChange(date)
                          }}
                        /> */}
                        <Input
                          type='date'
                          min={MIN_DOB}
                          max={MAX_DOB}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            field.onChange(date)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn giới tính' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='MALE'>Nam</SelectItem>
                          <SelectItem value='FEMALE'>Nữ</SelectItem>
                          <SelectItem value='OTHER'>Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn vai trò' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentUserRole === 'ADMIN' && (
                            <>
                              <SelectItem value='PARENT'>Phụ huynh</SelectItem>
                              <SelectItem value='DRIVER'>Tài xế xe buýt</SelectItem>
                              <SelectItem value='ASSISTANT'>Phụ tá tài xế</SelectItem>
                            </>
                          )}
                          {currentUserRole === 'SYSADMIN' && (
                            <>
                              <SelectItem value='ADMIN'>Quản lý</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12'>
                <h3 className='mb-2 font-medium'>Thông tin địa chỉ</h3>
              </div>
              <FormField
                control={control}
                name='province'
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn tỉnh/thành phố' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {address.map((province) => (
                          <SelectItem key={province.Id} value={province.Id || ''}>
                            {province.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='district'
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!provinceValue}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn quận/huyện' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.Id} value={district.Id || ''}>
                            {district.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='ward'
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Phường/Xã</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!districtValue}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn phường/xã' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.Id} value={ward.Id || ''}>
                            {ward.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='specificAddress'
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Địa chỉ cụ thể</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Số nhà, đường, ngõ...'
                        {...field}
                        disabled={!wardValue}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                        onBlur={() => {
                          field.onBlur()
                          setValue('specificAddress', trimValue(field.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className='mt-4'>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
