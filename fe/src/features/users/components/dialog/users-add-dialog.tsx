'use client'

// path: fe/src/features/users/components/dialog/users-add-dialog.tsx
import { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUsers } from '../../context/users-context'

// Schema cho việc thêm mới người dùng
const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ và tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dob: z.coerce.date({ required_error: 'Vui lòng chọn ngày sinh' }),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Hàm tạo username tự động bằng uuid
const generateUsername = (): string => uuidv4()

// Hàm tạo password tự động với độ dài ngẫu nhiên từ 8 đến 36 ký tự,
// đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường và 1 số.
const generatePassword = (): string => {
  const length = Math.floor(Math.random() * (36 - 8 + 1)) + 8
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const allChars = uppercase + lowercase + digits

  let password = ''
  // Bắt buộc có 1 chữ hoa, 1 chữ thường, 1 số
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += digits[Math.floor(Math.random() * digits.length)]

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Trộn các ký tự để tránh mẫu cố định
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
  return password
}

// Hàm tạo avatar tự động: random số từ 1 đến 50 được thêm vào URL
const generateAvatar = (): string => {
  const randomNumber = Math.floor(Math.random() * 50) + 1
  return `https://avatar.iran.liara.run/public/${randomNumber}`
}

export function UsersAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { refreshUsers } = useUsers()

  // Khởi tạo React Hook Form với schema
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gender: 'MALE',
      dob: undefined,
      role: '',
    },
  })

  const { control, handleSubmit, reset } = form

  // Xử lý submit: tạo các trường tự động và gọi API thêm người dùng mới
  const onSubmit = async (values: UserForm) => {
    try {
      setIsSubmitting(true)
      const newUser = {
        username: generateUsername(),
        password: generatePassword(),
        email: values.email,
        phone: values.phone,
        name: values.name,
        address: values.address,
        gender: values.gender,
        dob: values.dob.toISOString(),
        avatar: generateAvatar(),
        role: values.role,
      }
      // Gọi API thêm người dùng mới
      const response = await API_SERVICES.users.addOne(newUser)
      console.log('response', response)
      toast({
        title: 'Thêm người dùng thành công',
        description: 'Người dùng mới đã được thêm vào hệ thống',
      })
      reset()
      onOpenChange(false)
      refreshUsers() // Cập nhật danh sách người dùng sau khi thêm mới

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error)
      toast({
        title: 'Không thể thêm người dùng',
        description: 'Đã xảy ra lỗi khi thêm người dùng mới. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>Tạo người dùng mới.</DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='user-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              {/* Họ và tên */}
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Quang Lợi' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='loinq@gmail.com' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Số điện thoại */}
              <FormField
                control={control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='0912345000' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Địa chỉ */}
              <FormField
                control={control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='74 An Dương' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Ngày sinh */}
              <FormField
                control={control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Ngày sinh</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant='outline' className={cn('col-span-4 w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Giới tính */}
              <FormField
                control={control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-12 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Giới tính</FormLabel>
                    <FormControl>
                      <select className='col-span-4 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value='MALE'>Nam</option>
                        <option value='FEMALE'>Nữ</option>
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Vai trò */}
              <FormField
                control={control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-12 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Vai trò</FormLabel>
                    <FormControl>
                      <select className='col-span-4 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value=''>Chọn vai trò</option>
                        <option value='PARENT'>Phụ huynh</option>
                        <option value='TEACHER'>Giáo viên</option>
                        <option value='ADMIN'>Quản trị</option>
                        {/* Thêm các vai trò khác nếu cần */}
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
