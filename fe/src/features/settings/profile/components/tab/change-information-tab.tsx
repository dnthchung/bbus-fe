import { useMemo, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon, CaretSortIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { CheckIcon, Loader2 } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { useAuthQuery } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Status } from '@/components/mine/status'

const genders = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
]

const statusOptions = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Tạm khóa', value: 'SUSPENDED' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
]

const roleOptions = [
  { label: 'Quản trị hệ thống', value: 'SYSADMIN' },
  { label: 'Quản trị viên', value: 'ADMIN' },
  { label: 'Người dùng', value: 'USER' },
  { label: 'Khách', value: 'GUEST' },
]

const informationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên phải có ít nhất 2 ký tự.')
    .max(30, 'Tên không được quá 30 ký tự.')
    .refine((val) => !/[!@#$%^&*()_+\-=\[\]{}\\|;:'".?/]/g.test(val), {
      message: 'Tên không được chứa ký tự đặc biệt.',
    }),

  email: z
    .string()
    .email('Vui lòng nhập một địa chỉ email hợp lệ.')
    .transform((val) => val.trim()),

  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số.')
    .max(11, 'Số điện thoại tối đa 11 số.')
    .transform((val) => val.trim())
    .refine((val) => !/[!@#$%^&*()_+\-=\[\]{}\\|;:'"?/]/g.test(val), {
      message: 'Số điện thoại không được chứa ký tự đặc biệt.',
    }),

  gender: z.string(),

  dob: z.date({ required_error: 'Ngày sinh là bắt buộc' }),

  address: z
    .string()
    .trim()
    .min(2, 'Địa chỉ phải có ít nhất 2 ký tự.')
    .max(100, 'Địa chỉ không được quá 100 ký tự.')
    .refine((val) => !/[!@#$%^&*()_+\-=\[\]{}\\|;:'"?/]/g.test(val), {
      message: 'Địa chỉ không được chứa ký tự đặc biệt.',
    }),
})

type InformationFormValues = z.infer<typeof informationSchema>

export default function InformationTab() {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const { user, isLoading } = useAuthQuery()

  const defaultValues = useMemo(() => {
    if (!user) return undefined

    console.log('Default values:', user)

    return {
      id: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dob: new Date(user.dob),
      address: user.address ?? '',
    }
  }, [user])

  const form = useForm<InformationFormValues>({
    resolver: zodResolver(informationSchema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form

  const isAdmin = user?.role === 'SYSADMIN' || user?.role === 'ADMIN'

  const onSubmit = async (data: InformationFormValues) => {
    try {
      const userDataToUpdate = {
        ...user,
        ...data,
        id: user?.userId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
      }

      await API_SERVICES.users.update(userDataToUpdate)

      // ✅ Refetch lại dữ liệu user sau khi update
      queryClient.invalidateQueries({ queryKey: ['authUser'] })

      toast({
        title: 'Cập nhật thành công!',
        description: 'Thông tin cá nhân đã được cập nhật.',
        variant: 'success',
      })

      form.reset(data)
      setIsEditing(false)
    } catch (error: any) {
      console.error('Lỗi cập nhật:', error)
      toast({
        title: 'Cập nhật thất bại!',
        description: error?.message || 'Có lỗi xảy ra khi cập nhật thông tin.',
        variant: 'deny',
      })
    }
  }

  const onCancelEdit = () => {
    form.reset()
    setIsEditing(false)
  }

  if (isLoading || !user) return <p className='text-muted-foreground'>Đang tải thông tin người dùng...</p>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col-reverse items-start justify-between md:flex-row md:items-start'>
          <div className='w-full md:pr-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đầy đủ</FormLabel>
                    <FormControl>
                      <Input placeholder='Tên đầy đủ' {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='Địa chỉ email' {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='Số điện thoại' {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant='outline' className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} disabled={!isEditing}>
                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      {isEditing && (
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} />
                        </PopoverContent>
                      )}
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')} disabled={!isEditing}>
                            {genders.find((g) => g.value === field.value)?.label || 'Chọn giới tính'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      {isEditing && (
                        <PopoverContent className='w-full p-0'>
                          <Command>
                            <CommandInput placeholder='Tìm giới tính...' />
                            <CommandEmpty>Không tìm thấy giới tính.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {genders.map((g) => (
                                  <CommandItem key={g.value} value={g.label} onSelect={() => form.setValue('gender', g.value)}>
                                    <CheckIcon className={cn('mr-2 h-4 w-4', g.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                    {g.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      )}
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='Địa chỉ của bạn' {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* STATIC ROLE & STATUS */}
            {/* STATIC ROLE & STATUS */}
            {isAdmin && (
              <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <p className='text-sm text-muted-foreground'>Vai trò</p>
                  <Status color='blue' showDot>
                    {roleOptions.find((r) => r.value === user?.role)?.label || user?.role}
                  </Status>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Trạng thái</p>
                  <Status color={user?.status === 'ACTIVE' ? 'green' : user?.status === 'SUSPENDED' ? 'red' : user?.status === 'PENDING' ? 'yellow' : 'gray'} showDot>
                    {statusOptions.find((s) => s.value === user?.status)?.label || user?.status}
                  </Status>
                </div>
              </div>
            )}

            <div className='mt-6 flex justify-end space-x-4'>
              {!isEditing ? (
                <Button type='button' onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button type='button' variant='outline' onClick={onCancelEdit}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Lưu
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
