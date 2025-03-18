import { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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

const userData = {
  id: 'a9ce782b-15ae-4610-b541-e4ef71f9cfef',
  username: 'sysadmin', // Giữ lại trong data nhưng không hiển thị
  name: 'Tài khoản sysadmin',
  gender: 'MALE',
  dob: '2025-02-16',
  email: 'sysadmin@gmail.com',
  avatar: 'https://avatar.iran.liara.run/public/21',
  phone: '0912345671',
  address: '74 An Dương',
  status: 'ACTIVE',
  role: 'SYSADMIN',
  twoFactorEnabled: true,
  lastLogin: '2025-03-15T08:24:16Z',
  accountCreated: '2024-10-05T14:30:00Z',
}

const isAdmin = userData.role === 'SYSADMIN' || userData.role === 'ADMIN'

const informationSchema = z.object({
  // username: z.string().min(4, 'Tên người dùng phải có ít nhất 4 ký tự.'), // Comment schema username
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự.').max(30, 'Tên không được quá 30 ký tự.'),
  email: z.string().email('Vui lòng nhập một địa chỉ email hợp lệ.'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số.').max(11, 'Số điện thoại tối đa 11 số.'),
  gender: z.string(),
  dob: z.date({ required_error: 'Ngày sinh là bắt buộc' }),
  address: z.string().optional(),
  role: z.string(),
  status: z.string(),
  twoFactorEnabled: z.boolean(),
})

type InformationFormValues = z.infer<typeof informationSchema>

const defaultValues: InformationFormValues = {
  // username: userData.username, // Comment default value username
  name: userData.name,
  email: userData.email,
  phone: userData.phone,
  gender: userData.gender,
  dob: new Date(userData.dob),
  address: userData.address,
  role: userData.role,
  status: userData.status,
  twoFactorEnabled: userData.twoFactorEnabled,
}

export default function InformationTab() {
  const [isEditing, setIsEditing] = useState(false)
  const form = useForm<InformationFormValues>({
    resolver: zodResolver(informationSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: InformationFormValues) {
    toast({
      title: 'Cập nhật thành công!',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    setIsEditing(false)
  }

  const onCancelEdit = () => {
    form.reset()
    setIsEditing(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col-reverse items-start justify-between md:flex-row md:items-start'>
          <div className='w-full md:pr-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {/* Comment phần username */}
              {/* <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder='Tên người dùng' {...field} disabled={!isEditing || !isAdmin} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* NAME */}
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

              {/* EMAIL */}
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

              {/* PHONE */}
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

              {/* DOB */}
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

              {/* GENDER */}
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
                            {field.value ? genders.find((g) => g.value === field.value)?.label : 'Chọn giới tính'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      {isEditing && (
                        <PopoverContent className='w-full p-0'>
                          <Command>
                            <CommandInput placeholder='Tìm kiếm giới tính...' />
                            <CommandEmpty>Không tìm thấy giới tính.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {genders.map((g) => (
                                  <CommandItem
                                    key={g.value}
                                    value={g.label}
                                    onSelect={() => {
                                      form.setValue('gender', g.value)
                                    }}
                                  >
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

              {/* ADDRESS */}
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

              {/* ROLE (chỉ sửa nếu là Admin/Sysadmin) */}
              {isAdmin && (
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')} disabled={!isEditing}>
                              {roleOptions.find((r) => r.value === field.value)?.label || 'Chọn vai trò'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        {isEditing && (
                          <PopoverContent className='w-full p-0'>
                            <Command>
                              <CommandInput placeholder='Tìm vai trò...' />
                              <CommandEmpty>Không tìm thấy.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {roleOptions.map((r) => (
                                    <CommandItem
                                      key={r.value}
                                      value={r.label}
                                      onSelect={() => {
                                        form.setValue('role', r.value)
                                      }}
                                    >
                                      <CheckIcon className={cn('mr-2 h-4 w-4', r.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                      {r.label}
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
              )}

              {/* STATUS (chỉ sửa nếu là Admin/Sysadmin) */}
              {isAdmin && (
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')} disabled={!isEditing}>
                              {statusOptions.find((s) => s.value === field.value)?.label || 'Chọn trạng thái'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        {isEditing && (
                          <PopoverContent className='w-full p-0'>
                            <Command>
                              <CommandInput placeholder='Tìm trạng thái...' />
                              <CommandEmpty>Không tìm thấy.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {statusOptions.map((s) => (
                                    <CommandItem
                                      key={s.value}
                                      value={s.label}
                                      onSelect={() => {
                                        form.setValue('status', s.value)
                                      }}
                                    >
                                      <CheckIcon className={cn('mr-2 h-4 w-4', s.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                      {s.label}
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
              )}
            </div>

            {/* ACTION BUTTONS */}
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
                  <Button type='submit'>Lưu</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
