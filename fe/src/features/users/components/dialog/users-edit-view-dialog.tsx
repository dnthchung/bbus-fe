'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSimple, type Province, type District, type Ward } from '@/helpers/addressSimple'
import { Upload, X } from 'lucide-react'
// (1) Import API & hooks
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
// (2) Import UI components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectDropdown } from '@/components/common/select-dropdown'
// (3) Import data & types
import { statusLabels } from '../../data'
import type { User } from '../../schema'

// Định nghĩa các định dạng file ảnh được chấp nhận
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Đường dẫn đến ảnh avatar mặc định
const DEFAULT_AVATAR_PATH = '/images/defaultAvatar.png'

// (4) Tạo schema có trường status và các trường địa chỉ chi tiết
const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  username: z.string().optional(), // Username không cần validate vì không cho phép sửa
  phone: z.string().min(1, { message: 'Số điện thoại không được để trống.' }),
  email: z.string().min(1, { message: 'Email không được để trống.' }).email({ message: 'Email không hợp lệ.' }),
  role: z.string().min(1, { message: 'Vai trò không được để trống.' }),
  status: z.string().min(1, { message: 'Trạng thái không được để trống.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dob: z.preprocess((val) => (val ? new Date(val as string | number | Date) : undefined), z.date().optional()),
  // Địa chỉ đầy đủ
  address: z.string().optional(),
  // Các trường địa chỉ chi tiết (chỉ validate khi đang edit)
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  specificAddress: z.string().optional(),
  // Avatar
  avatar: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), 'Kích thước file không được vượt quá 5MB')
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif'),
  avatarUrl: z.string().optional(), // URL của avatar hiện tại
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersEditViewDialog({ currentRow, open, onOpenChange }: Props) {
  // State cho toggle edit & loading
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State cho avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // State cho địa chỉ
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  // State cho role người dùng hiện tại
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  // Dữ liệu fetch được từ API
  const [userData, setUserData] = useState<User | null>(null)

  // Lấy role người dùng hiện tại từ localStorage
  useEffect(() => {
    try {
      const role = localStorage.getItem('role')
      setCurrentUserRole(role || null)
    } catch (error) {
      console.error('Error reading user role from localStorage:', error)
    }
  }, [])

  // Mỗi khi mở dialog & có userId => fetch dữ liệu
  useEffect(() => {
    if (open && currentRow?.userId) {
      setLoading(true)
      API_SERVICES.users
        .getOne(currentRow.userId)
        .then((response) => {
          setUserData(response.data)
          // Nếu có avatar URL, set preview
          if (response.data?.avatarUrl) {
            setAvatarPreview(response.data.avatarUrl)
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error)
        })
        .finally(() => setLoading(false))
    } else {
      // Nếu đóng dialog hoặc currentRow rỗng => reset userData
      setUserData(null)
      setAvatarPreview(null)
    }
  }, [open, currentRow])

  // Khởi tạo form
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    // Nếu có currentRow => fill trước; tuỳ logic, bạn có thể dùng userData
    defaultValues: currentRow || {},
  })

  const { watch, setValue, formState } = form

  // Watch các giá trị địa chỉ để cập nhật
  const provinceValue = watch('province')
  const districtValue = watch('district')
  const wardValue = watch('ward')
  const specificAddressValue = watch('specificAddress')

  // Cập nhật danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (provinceValue) {
      const province = addressSimple.find((p) => p.Id === provinceValue)
      setSelectedProvince(province || null)
      setDistricts(province?.Districts || [])
      setValue('district', '')
      setValue('ward', '')
      setWards([])
    }
  }, [provinceValue, setValue])

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (districtValue && selectedProvince) {
      const district = selectedProvince.Districts?.find((d) => d.Id === districtValue)
      setSelectedDistrict(district || null)
      setWards(district?.Wards || [])
      setValue('ward', '')
    }
  }, [districtValue, selectedProvince, setValue])

  // Cập nhật địa chỉ đầy đủ khi các thành phần địa chỉ thay đổi
  useEffect(() => {
    if (isEditing && provinceValue && districtValue && wardValue && specificAddressValue) {
      const provinceName = addressSimple.find((p) => p.Id === provinceValue)?.Name || ''
      const districtName = districts.find((d) => d.Id === districtValue)?.Name || ''
      const wardName = wards.find((w) => w.Id === wardValue)?.Name || ''
      const fullAddress = `${specificAddressValue}, ${wardName}, ${districtName}, ${provinceName}`
      setValue('address', fullAddress)
    }
  }, [provinceValue, districtValue, wardValue, specificAddressValue, districts, wards, setValue, isEditing])

  // Xử lý khi chọn file ảnh
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Kiểm tra định dạng file
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Định dạng file không hợp lệ',
          description: 'Chỉ chấp nhận các đ��nh dạng ảnh: .jpg, .jpeg, .png, .webp, .gif',
          variant: 'destructive',
        })
        return
      }

      // Kiểm tra kích thước file
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'Kích thước file quá lớn',
          description: 'Kích thước file không được vượt quá 5MB',
          variant: 'destructive',
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

  // Xử lý xóa ảnh đã chọn
  const handleRemoveAvatar = () => {
    setValue('avatar', undefined)
    setAvatarPreview(null)
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  // Xử lý submit form
  const onSubmit = async (values: UserForm) => {
    try {
      setIsSubmitting(true)

      // Tạo FormData để gửi dữ liệu dạng multipart/form-data
      const formData = new FormData()

      // Thêm các trường thông tin cơ bản
      formData.append('userId', currentRow?.userId || '')
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('name', values.name)
      formData.append('address', values.address || '')
      formData.append('gender', values.gender)
      if (values.dob) {
        formData.append('dob', values.dob.toISOString())
      }
      formData.append('role', values.role)
      formData.append('status', values.status)

      // Thêm file avatar nếu có
      if (values.avatar instanceof File) {
        formData.append('avatar', values.avatar)
      }

      // Gọi API cập nhật người dùng với FormData
      console.log('Gọi API cập nhật người dùng với FormData')
      // await API_SERVICES.users.updateOne(currentRow?.userId || '', formData)

      toast({
        title: 'Cập nhật người dùng thành công',
        description: 'Thông tin người dùng đã được cập nhật',
        variant: 'success',
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
      toast({
        title: 'Không thể cập nhật người dùng',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel edit
  const onCancelEdit = () => {
    form.reset()
    setIsEditing(false)
    // Reset avatar preview về giá trị ban đầu
    setAvatarPreview(userData?.avatar || null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // Mỗi khi đóng dialog => reset form & disable edit
        form.reset()
        setIsEditing(false)
        setAvatarPreview(null)
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEditing ? 'Chỉnh sửa người dùng' : 'Thông tin người dùng'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Cập nhật thông tin người dùng.' : 'Xem thông tin chi tiết người dùng.'}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 max-h-[70vh] w-full py-1 pr-4'>
          {/* Nếu đang loading => hiển thị chờ */}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <Form {...form}>
              <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 p-0.5'>
                {/* Avatar upload */}
                <div className='mb-4 flex flex-col items-center space-y-2'>
                  <div className='relative'>
                    <Avatar className='h-24 w-24'>
                      {avatarPreview ? <AvatarImage src={avatarPreview || '/placeholder.svg'} alt='Avatar preview' /> : <AvatarImage src={DEFAULT_AVATAR_PATH || '/placeholder.svg'} alt='Default avatar' />}
                      <AvatarFallback>
                        <span className='text-2xl'>👤</span>
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && avatarPreview && (
                      <Button type='button' variant='destructive' size='icon' className='absolute -right-2 -top-2 h-6 w-6 rounded-full' onClick={handleRemoveAvatar}>
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                  {isEditing && (
                    <div className='flex items-center'>
                      <label htmlFor='avatar-upload' className='flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                        <Upload className='mr-2 h-4 w-4' />
                        Tải ảnh lên
                      </label>
                      <input id='avatar-upload' type='file' accept='image/*' className='hidden' onChange={handleAvatarChange} />
                    </div>
                  )}
                  {formState.errors.avatar && <p className='text-sm text-destructive'>{formState.errors.avatar.message as string}</p>}
                </div>

                {/* Thông tin cơ bản - dàn ngang */}
                <div className='grid grid-cols-2 gap-4'>
                  {/* Họ tên */}
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder='Nguyễn Văn A' {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='example@gmail.com' {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {/* Số điện thoại */}
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder='+84123456789' {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ngày sinh */}
                  <FormField
                    control={form.control}
                    name='dob'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            min='1900-01-01'
                            max={new Date().toISOString().split('T')[0]}
                            value={field.value && field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined
                              field.onChange(date)
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {/* Giới tính */}
                  <FormField
                    control={form.control}
                    name='gender'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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

                  {/* Vai trò */}
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn vai trò' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentUserRole === 'ADMIN' && (
                              <>
                                <SelectItem value='PARENT'>Phụ huynh</SelectItem>
                                <SelectItem value='TEACHER'>Giáo viên</SelectItem>
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

                <div className='grid grid-cols-2 gap-4'>
                  {/* Trạng thái (status) */}
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Chọn trạng thái'
                            items={Object.entries(statusLabels).map(([key, label]) => ({
                              label, // Ví dụ: 'Đang hoạt động', 'Không hoạt động'
                              value: key, // Ví dụ: 'ACTIVE', 'INACTIVE'
                            }))}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Địa chỉ */}
                {!isEditing ? (
                  // Khi xem: chỉ hiển thị địa chỉ đầy đủ
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  // Khi chỉnh sửa: hiển thị các trường địa chỉ chi tiết
                  <>
                    <div className='grid grid-cols-2 gap-4'>
                      {/* Tỉnh/Thành phố */}
                      <FormField
                        control={form.control}
                        name='province'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Chọn tỉnh/thành phố' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {addressSimple.map((province) => (
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

                      {/* Quận/Huyện */}
                      <FormField
                        control={form.control}
                        name='district'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!provinceValue}>
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
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      {/* Phường/Xã */}
                      <FormField
                        control={form.control}
                        name='ward'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!districtValue}>
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

                      {/* Địa chỉ cụ thể */}
                      <FormField
                        control={form.control}
                        name='specificAddress'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ cụ thể</FormLabel>
                            <FormControl>
                              <Input placeholder='Số nhà, đường, ngõ...' {...field} disabled={!wardValue} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </form>
            </Form>
          )}
        </ScrollArea>
        {/* Footer: nút bấm */}
        <DialogFooter>
          {!isEditing ? (
            <Button type='button' onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button type='button' variant='outline' onClick={onCancelEdit}>
                Hủy
              </Button>
              <Button type='submit' form='user-form' disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
