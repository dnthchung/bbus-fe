'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSimple, type Province, type District, type Ward } from '@/helpers/addressSimple'
import { CalendarIcon, Search, UserPlus, Check, Upload, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User } from '@/features/users/schema'
import { getParentListFromParentTable } from '@/features/users/users'
import { useStudents } from '../../context/students-context'

// Định nghĩa các định dạng file ảnh được chấp nhận
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Đường dẫn đến ảnh avatar mặc định
const DEFAULT_AVATAR_PATH = '/images/defaultAvatar.png'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống' }),
  dob: z.coerce.date({ required_error: 'Vui lòng chọn ngày sinh hợp lệ' }),
  province: z.string().min(1, { message: 'Vui lòng chọn tỉnh/thành phố' }),
  district: z.string().min(1, { message: 'Vui lòng chọn quận/huyện' }),
  ward: z.string().min(1, { message: 'Vui lòng chọn phường/xã' }),
  specificAddress: z.string().min(1, { message: 'Địa chỉ cụ thể không được để trống' }),
  address: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính hợp lệ' }),
  }),
  parentId: z.string().uuid({ message: 'Vui lòng chọn phụ huynh hợp lệ' }).min(1, { message: 'Phụ huynh không được để trống' }),
  avatar: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), 'Kích thước file không được vượt quá 5MB')
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif'),
})

type StudentForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const generateRollNumber = (): string => {
  return `HS${uuidv4()}`
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

  // Fetch parents when dialog opens
  useEffect(() => {
    async function fetchParents() {
      try {
        const parents = await getParentListFromParentTable()
        const transformedParents = parents.map((parent) => ({
          ...parent,
          userId: parent.id,
          username: parent.id, // or any default value
          role: 'PARENT' as const,
        }))
        setParentUsers(transformedParents)
      } catch (error) {
        console.error('Error fetching parent users:', error)
        toast({
          title: 'Không thể tải danh sách phụ huynh',
          description: 'Vui lòng thử lại sau',
          variant: 'destructive',
        })
      }
    }
    if (open) {
      fetchParents()
    }
  }, [open])

  // Setup React Hook Form
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
      parentId: '',
      avatar: undefined,
    },
  })

  const { control, handleSubmit, reset, watch, setValue, formState } = form

  // Watch form values
  const provinceValue = watch('province')
  const districtValue = watch('district')
  const wardValue = watch('ward')
  const specificAddressValue = watch('specificAddress')
  const watchParentId = watch('parentId')

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
    if (provinceValue && districtValue && wardValue && specificAddressValue) {
      const provinceName = addressSimple.find((p) => p.Id === provinceValue)?.Name || ''
      const districtName = districts.find((d) => d.Id === districtValue)?.Name || ''
      const wardName = wards.find((w) => w.Id === wardValue)?.Name || ''
      const fullAddress = `${specificAddressValue}, ${wardName}, ${districtName}, ${provinceName}`
      setValue('address', fullAddress)
    }
  }, [provinceValue, districtValue, wardValue, specificAddressValue, districts, wards, setValue])

  // Filter parents by search term
  const filteredParentUsers = parentUsers.filter((parent) => {
    const lower = searchTerm.toLowerCase()
    return parent.name.toLowerCase().includes(lower) || (parent.phone && parent.phone.includes(searchTerm))
  })

  // Find selected parent
  const selectedParent = parentUsers.find((p) => p.userId === watchParentId)

  // Select parent and update form
  const handleSelectParent = (parentId: string) => {
    setValue('parentId', parentId)
    // Switch back to form tab on mobile after selection
    if (window.innerWidth < 768) {
      setActiveTab('form')
    }
  }

  // Xử lý khi chọn file ảnh
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Kiểm tra định dạng file
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Định dạng file không hợp lệ',
          description: 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif',
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

  // Submit form
  const onSubmit = async (values: StudentForm) => {
    try {
      setIsSubmitting(true)

      // Tạo FormData để gửi dữ liệu dạng multipart/form-data
      const formData = new FormData()
      formData.append('rollNumber', generateRollNumber())
      formData.append('name', values.name)

      // Format date to yyyy-MM-dd instead of ISO string
      const formattedDate = format(values.dob, 'yyyy-MM-dd')
      formData.append('dob', formattedDate)

      formData.append('address', values.address || '')
      formData.append('gender', values.gender)
      formData.append('status', 'ACTIVE')
      formData.append('parentId', values.parentId)
      formData.append('checkpointId', '')

      // Thêm file avatar nếu có, nếu không thì sử dụng avatar mặc định
      if (values.avatar instanceof File) {
        formData.append('avatar', values.avatar)
      } else {
        // Tạo một file từ avatar mặc định
        try {
          const response = await fetch(DEFAULT_AVATAR_PATH)
          const blob = await response.blob()
          const defaultAvatarFile = new File([blob], 'defaultAvatar.png', { type: blob.type })
          formData.append('avatar', defaultAvatarFile)
        } catch (error) {
          console.error('Lỗi khi tải avatar mặc định:', error)
          // Fallback: gửi đường dẫn nếu không thể tạo file
          formData.append('avatarPath', DEFAULT_AVATAR_PATH)
        }
      }

      await API_SERVICES.students.addOne(formData)

      // Đảm bảo cập nhật danh sách học sinh trước
      await refreshStudents()

      toast({
        title: 'Thêm học sinh thành công',
        description: 'Học sinh mới đã được thêm vào hệ thống',
        variant: 'success',
      })

      reset()
      setAvatarPreview(null)
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
      toast({
        title: `${error || 'Không thể thêm học sinh'}`,
        description: 'Đã xảy ra lỗi khi thêm học sinh mới. Vui lòng thử lại sau.',
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
            {/* Mobile Tabs */}
            <div className='px-6 md:hidden'>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'parents')}>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='form'>Thông tin học sinh</TabsTrigger>
                  <TabsTrigger value='parents'>
                    Chọn phụ huynh
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
            {/* Desktop Layout */}
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
              <div className='flex justify-end gap-2'>
                <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                  {isSubmitting ? 'Đang tạo...' : 'Tạo học sinh'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Student Form Fields Component
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
        {/* Avatar upload */}
        <div className='mb-4 flex flex-col items-center space-y-2'>
          <div className='relative'>
            <Avatar className='h-24 w-24'>
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

        {/* Name */}
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder='Nguyễn Tuấn Hùng' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={control}
          name='dob'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tỉnh/Thành phố */}
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

        {/* Phường/Xã */}
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
          control={control}
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

        {/* Gender */}
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

        {/* Parent Selection */}
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

// Parent Selector Component
interface ParentSelectorProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredParentUsers: User[]
  handleSelectParent: (parentId: string) => void
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
            {filteredParentUsers.map((parent) => (
              <div key={parent.userId} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors', selectedParentId === parent.userId ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted')} onClick={() => handleSelectParent(parent.userId)}>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>{parent.name.charAt(0).toUpperCase()}</div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>{parent.name}</p>
                  <p className='truncate text-sm text-muted-foreground'>{parent.phone || 'Không có SĐT'}</p>
                </div>
                {selectedParentId === parent.userId && <Check className='h-4 w-4 text-primary' />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
