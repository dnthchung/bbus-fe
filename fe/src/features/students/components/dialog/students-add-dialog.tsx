'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSimple, type Province, type District, type Ward } from '@/helpers/addressSimple'
import { Search, UserPlus, Check, Upload, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User } from '@/features/users/schema'
import { getParentListFromParentTable } from '@/features/users/users'
import { useStudents } from '../../context/students-context'

/* ---------- CONSTANTS ---------- */

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const DEFAULT_AVATAR_PATH = '/images/defaultAvatar.png'

const GRADES = ['1', '2', '3', '4', '5'] as const
const CLASS_SUFFIXES = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/* ---------- SCHEMA ---------- */

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Họ và tên không được để trống' })
    .refine((v) => !v.startsWith(' '), {
      message: 'Họ và tên không được bắt đầu bằng khoảng trắng',
    }),
  dob: z.coerce.date({
    required_error: 'Vui lòng chọn ngày sinh hợp lệ',
  }),
  province: z.string().min(1, { message: 'Vui lòng chọn tỉnh/thành phố' }),
  district: z.string().min(1, { message: 'Vui lòng chọn quận/huyện' }),
  ward: z.string().min(1, { message: 'Vui lòng chọn phường/xã' }),
  specificAddress: z
    .string()
    .min(1, { message: 'Địa chỉ cụ thể không được để trống' })
    .refine((v) => !v.startsWith(' '), {
      message: 'Địa chỉ không được bắt đầu bằng khoảng trắng',
    }),
  address: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính hợp lệ' }),
  }),
  grade: z.enum(GRADES, {
    errorMap: () => ({ message: 'Vui lòng chọn khối' }),
  }),
  classSuffix: z.enum(CLASS_SUFFIXES, {
    errorMap: () => ({ message: 'Vui lòng chọn lớp' }),
  }),
  parentId: z.string().uuid({ message: 'Vui lòng chọn phụ huynh hợp lệ' }).min(1, { message: 'Phụ huynh không được để trống' }),
  avatar: z
    .any()
    .optional()
    .refine((f) => !f || (f instanceof File && f.size <= MAX_FILE_SIZE), 'Kích thước file không được vượt quá 5MB')
    .refine((f) => !f || (f instanceof File && ACCEPTED_IMAGE_TYPES.includes(f.type)), 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif'),
})

type StudentForm = z.infer<typeof formSchema>

/* ---------- HELPERS ---------- */

const generateRollNumber = (): string => `HS${uuidv4()}`

/* ---------- CUSTOM INPUT ---------- */

interface TrimmedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  preventLeadingSpace?: boolean
  trimOnBlur?: boolean
}

function TrimmedInput({ preventLeadingSpace = true, trimOnBlur = true, value, onChange, onBlur, ...props }: TrimmedInputProps) {
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const v = e.target.value
        if (preventLeadingSpace && v === ' ' && value === '') return
        onChange?.(e)
      }}
      onBlur={(e) => {
        if (trimOnBlur) {
          const trimmed = e.target.value.trim()
          if (trimmed !== e.target.value) {
            const synthetic = {
              ...e,
              target: { ...e.target, value: trimmed },
            }
            // @ts-ignore
            onChange?.(synthetic)
          }
        }
        onBlur?.(e)
      }}
    />
  )
}

/* ---------- MAIN COMPONENT ---------- */

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StudentsAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentUsers, setParentUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'form' | 'parents'>('form')

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const { refreshStudents } = useStudents()

  /* ----- fetch parents when dialog open ----- */
  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        const parents = await getParentListFromParentTable()
        const transformed = parents.map((p) => ({
          userId: p.id,
          username: p.id,
          name: p.name,
          gender: p.gender,
          dob: p.dob,
          email: p.email,
          avatar: p.avatar,
          phone: p.phone,
          address: p.address,
          status: p.status,
          role: 'PARENT' as const,
          updatedAt: new Date(),
          createdAt: new Date(),
        }))
        setParentUsers(transformed)
      } catch (err) {
        console.error('Error fetching parent users:', err)
        toast({
          title: 'Không thể tải danh sách phụ huynh',
          description: 'Vui lòng thử lại sau',
          variant: 'destructive',
        })
      }
    })()
  }, [open])

  /* ----- form setup ----- */
  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: undefined,
      province: '',
      district: '',
      ward: '',
      specificAddress: '',
      address: '',
      gender: 'MALE',
      // grade: '',
      // classSuffix: '',
      parentId: '',
      avatar: undefined,
    },
  })

  const { control, handleSubmit, reset, watch, setValue, formState } = form

  /* ----- address watchers ----- */
  const provinceValue = watch('province')
  const districtValue = watch('district')
  const wardValue = watch('ward')
  const specificAddressValue = watch('specificAddress')
  const watchParentId = watch('parentId')

  /* ----- address effects ----- */
  useEffect(() => {
    if (!provinceValue) return
    const province = addressSimple.find((p) => p.Id === provinceValue)
    setSelectedProvince(province ?? null)
    setDistricts(province?.Districts ?? [])
    setValue('district', '')
    setValue('ward', '')
    setWards([])
  }, [provinceValue, setValue])

  useEffect(() => {
    if (!districtValue || !selectedProvince) return
    const district = selectedProvince.Districts?.find((d) => d.Id === districtValue)
    setSelectedDistrict(district ?? null)
    setWards(district?.Wards ?? [])
    setValue('ward', '')
  }, [districtValue, selectedProvince, setValue])

  useEffect(() => {
    if (provinceValue && districtValue && wardValue && specificAddressValue) {
      const provinceName = addressSimple.find((p) => p.Id === provinceValue)?.Name || ''
      const districtName = districts.find((d) => d.Id === districtValue)?.Name || ''
      const wardName = wards.find((w) => w.Id === wardValue)?.Name || ''
      const full = `${specificAddressValue}, ${wardName}, ${districtName}, ${provinceName}`
      setValue('address', full)
    }
  }, [provinceValue, districtValue, wardValue, specificAddressValue, districts, wards, setValue])

  /* ----- filter parents by search ----- */
  const filteredParentUsers = parentUsers.filter((p) => {
    const lower = searchTerm.toLowerCase()
    return p.name.toLowerCase().includes(lower) || (p.phone && p.phone.includes(searchTerm))
  })

  /* ----- selected parent ----- */
  const selectedParent = parentUsers.find((p) => p.userId === watchParentId)

  const handleSelectParent = (parentId: string) => {
    setValue('parentId', parentId)
    if (window.innerWidth < 768) setActiveTab('form')
  }

  /* ----- avatar ----- */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
        variant: 'destructive',
      })
      return
    }

    setValue('avatar', file)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setValue('avatar', undefined)
    setAvatarPreview(null)
    const input = document.getElementById('avatar-upload') as HTMLInputElement | undefined
    if (input) input.value = ''
  }

  /* ---------- SUBMIT ---------- */

  const onSubmit = async (values: StudentForm) => {
    const trimmed: StudentForm = {
      ...values,
      name: values.name.trim(),
      specificAddress: values.specificAddress.trim(),
    }

    if (!trimmed.name || !trimmed.specificAddress || !trimmed.parentId || !trimmed.grade || !trimmed.classSuffix) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ các trường bắt buộc',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)

      const fd = new FormData()
      fd.append('rollNumber', generateRollNumber())
      fd.append('name', trimmed.name)
      fd.append('dob', format(trimmed.dob, 'yyyy-MM-dd'))
      fd.append('address', trimmed.address || '')
      fd.append('gender', trimmed.gender)
      /* ---- gộp thành className ---- */
      fd.append('className', `${trimmed.grade}${trimmed.classSuffix}`)
      fd.append('status', 'ACTIVE')
      fd.append('parentId', trimmed.parentId)
      fd.append('checkpointId', '')

      if (trimmed.avatar instanceof File) {
        fd.append('avatar', trimmed.avatar)
      } else {
        try {
          const res = await fetch(DEFAULT_AVATAR_PATH)
          const blob = await res.blob()
          fd.append('avatar', new File([blob], 'defaultAvatar.png', { type: blob.type }))
        } catch {
          fd.append('avatarPath', DEFAULT_AVATAR_PATH)
        }
      }

      await API_SERVICES.students.addOne(fd)
      await refreshStudents()

      toast({
        title: 'Thêm học sinh thành công',
        description: 'Học sinh mới đã được thêm vào hệ thống',
        variant: 'success',
      })

      reset()
      setAvatarPreview(null)
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error('Lỗi khi thêm học sinh:', err)
      toast({
        title: 'Không thể thêm học sinh',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------- RENDER ---------- */

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          reset()
          setSearchTerm('')
          setAvatarPreview(null)
          setSelectedProvince(null)
          setSelectedDistrict(null)
          setDistricts([])
          setWards([])
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-w-4xl overflow-hidden p-0'>
        <DialogHeader className='px-6 pb-2 pt-6'>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <UserPlus className='h-5 w-5' />
            Thêm học sinh mới
          </DialogTitle>
          <DialogDescription>Tạo học sinh mới ở đây. Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='student-form' onSubmit={handleSubmit(onSubmit)}>
            {/* ---------- Mobile ---------- */}
            <div className='px-6 md:hidden'>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'parents')}>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='form'>Thông tin học sinh</TabsTrigger>
                  <TabsTrigger value='parents'>
                    Chọn phụ huynh{' '}
                    {selectedParent && (
                      <Badge variant='secondary' className='ml-2'>
                        <Check className='mr-1 h-3 w-3' />
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='form' className='mt-4'>
                  <StudentFormFields control={control} formState={formState} selectedParent={selectedParent} onSelectParentClick={() => setActiveTab('parents')} avatarPreview={avatarPreview} handleAvatarChange={handleAvatarChange} handleRemoveAvatar={handleRemoveAvatar} provinceValue={provinceValue} districtValue={districtValue} districts={districts} wards={wards} wardValue={wardValue} />
                </TabsContent>

                <TabsContent value='parents' className='mt-4'>
                  <ParentSelector searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredParentUsers={filteredParentUsers} handleSelectParent={handleSelectParent} selectedParentId={watchParentId} />
                </TabsContent>
              </Tabs>
            </div>

            {/* ---------- Desktop ---------- */}
            <div className='hidden gap-6 px-6 md:flex'>
              <div className='w-1/2'>
                <StudentFormFields control={control} formState={formState} selectedParent={selectedParent} avatarPreview={avatarPreview} handleAvatarChange={handleAvatarChange} handleRemoveAvatar={handleRemoveAvatar} provinceValue={provinceValue} districtValue={districtValue} districts={districts} wards={wards} wardValue={wardValue} />
              </div>
              <div className='w-1/2'>
                <h3 className='mb-2 text-sm font-medium'>Chọn phụ huynh</h3>
                <ParentSelector searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredParentUsers={filteredParentUsers} handleSelectParent={handleSelectParent} selectedParentId={watchParentId} />
              </div>
            </div>

            <DialogFooter className='bg-muted/30 px-6 py-4'>
              <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                {isSubmitting ? 'Đang tạo...' : 'Tạo học sinh'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- CHILD COMPONENTS ---------- */

interface StudentFormFieldsProps {
  control: any
  formState: any
  selectedParent: User | undefined
  onSelectParentClick?: () => void
  avatarPreview: string | null
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveAvatar: () => void
  provinceValue: string
  districtValue: string
  districts: District[]
  wards: Ward[]
  wardValue: string
}

function StudentFormFields({ control, formState, selectedParent, onSelectParentClick, avatarPreview, handleAvatarChange, handleRemoveAvatar, provinceValue, districtValue, districts, wards, wardValue }: StudentFormFieldsProps) {
  return (
    <ScrollArea className='h-[400px] pr-4'>
      <div className='space-y-4 pb-4'>
        {/* ---------- Avatar ---------- */}
        <div className='mb-4 flex flex-col items-center space-y-2'>
          <div className='relative'>
            <Avatar className='h-24 w-24'>
              {avatarPreview ? <AvatarImage src={avatarPreview} alt='Avatar preview' /> : <AvatarImage src={DEFAULT_AVATAR_PATH} alt='Avatar' />}
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

        {/* ---------- Name ---------- */}
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <TrimmedInput placeholder='Nguyễn Tuấn Hùng' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Date of Birth ---------- */}
        <FormField
          control={control}
          name='dob'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input type='date' max={new Date().toISOString().split('T')[0]} {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Grade ---------- */}
        <FormField
          control={control}
          name='grade'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khối</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn khối' />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Class suffix ---------- */}
        <FormField
          control={control}
          name='classSuffix'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn lớp' />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_SUFFIXES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Province ---------- */}
        <FormField
          control={control}
          name='province'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn tỉnh/thành phố' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {addressSimple.map((p) => (
                    <SelectItem key={p.Id} value={p.Id || ''}>
                      {p.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- District ---------- */}
        <FormField
          control={control}
          name='district'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quận/Huyện</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!provinceValue}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn quận/huyện' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.Id} value={d.Id || ''}>
                      {d.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Ward ---------- */}
        <FormField
          control={control}
          name='ward'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phường/Xã</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!districtValue}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn phường/xã' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.Id} value={w.Id || ''}>
                      {w.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Specific address ---------- */}
        <FormField
          control={control}
          name='specificAddress'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ cụ thể</FormLabel>
              <FormControl>
                <TrimmedInput placeholder='Số nhà, đường, ngõ...' disabled={!wardValue} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Gender ---------- */}
        <FormField
          control={control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Lựa chọn giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Giới tính</SelectLabel>
                      <SelectItem value='MALE'>Nam</SelectItem>
                      <SelectItem value='FEMALE'>Nữ</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- Parent ---------- */}
        <FormField
          control={control}
          name='parentId'
          render={() => (
            <FormItem>
              <FormLabel>Phụ huynh</FormLabel>

              <div className='space-y-2'>
                {selectedParent ? (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 rounded-md border bg-muted/50 p-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>{selectedParent.name.charAt(0).toUpperCase()}</div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium'>{selectedParent.name}</p>
                        <p className='truncate text-sm text-muted-foreground'>{selectedParent.phone || 'Không có SĐT'}</p>
                      </div>
                    </div>

                    {onSelectParentClick && (
                      <Button type='button' variant='outline' size='sm' onClick={onSelectParentClick}>
                        Thay đổi phụ huynh
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    {onSelectParentClick ? (
                      <Button type='button' variant='outline' className='w-full justify-start text-muted-foreground' onClick={onSelectParentClick}>
                        <Search className='mr-2 h-4 w-4' />
                        Chọn phụ huynh
                      </Button>
                    ) : (
                      <p className='p-2 text-sm text-muted-foreground'>Vui lòng chọn phụ huynh từ danh sách bên phải</p>
                    )}
                  </div>
                )}

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </ScrollArea>
  )
}

interface ParentSelectorProps {
  searchTerm: string
  setSearchTerm: (s: string) => void
  filteredParentUsers: User[]
  handleSelectParent: (id: string) => void
  selectedParentId: string
}

function ParentSelector({ searchTerm, setSearchTerm, filteredParentUsers, handleSelectParent, selectedParentId }: ParentSelectorProps) {
  return (
    <div className='space-y-2'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input placeholder='Tìm phụ huynh theo tên/điện thoại' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-9' />
      </div>

      <ScrollArea className='h-[340px] rounded-md border'>
        {filteredParentUsers.length === 0 ? (
          <div className='p-4 text-center text-muted-foreground'>Không tìm thấy phụ huynh phù hợp</div>
        ) : (
          <div className='divide-y'>
            {filteredParentUsers.map((p) => (
              <div key={p.userId} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors', selectedParentId === p.userId ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted')} onClick={() => handleSelectParent(p.userId)}>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>{p.name.charAt(0).toUpperCase()}</div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>{p.name}</p>
                  <p className='truncate text-sm text-muted-foreground'>{p.phone || 'Không có SĐT'}</p>
                </div>
                {selectedParentId === p.userId && <Check className='h-4 w-4 text-primary' />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
