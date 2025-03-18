//path : fe/src/features/settings/account/account-form.tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Dữ liệu ví dụ bạn có thể nhận từ API:
const userData = {
  id: 'a9ce782b-15ae-4610-b541-e4ef71f9cfef',
  username: 'sysadmin',
  name: 'Tài khoản sysadmin',
  email: 'sysadmin@gmail.com',
  phone: '0912345671',
  status: 'ACTIVE',
  role: 'SYSADMIN',
  twoFactorEnabled: true,
  lastLogin: '2025-03-15T08:24:16Z',
  accountCreated: '2024-10-05T14:30:00Z',
}

// Các giá trị cho trạng thái tài khoản
const statusOptions = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Tạm khóa', value: 'SUSPENDED' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
]

// Các giá trị cho vai trò
const roleOptions = [
  { label: 'Quản trị hệ thống', value: 'SYSADMIN' },
  { label: 'Quản trị viên', value: 'ADMIN' },
  { label: 'Người dùng', value: 'USER' },
  { label: 'Khách', value: 'GUEST' },
]

// Mở rộng schema Zod cho phần tài khoản/xác thực
const accountFormSchema = z
  .object({
    username: z.string().min(4, { message: 'Tên người dùng phải có ít nhất 4 ký tự.' }),
    email: z.string().email('Vui lòng nhập một địa chỉ email hợp lệ.'),
    phone: z.string().optional(),
    role: z.string(),
    status: z.string(),
    twoFactorEnabled: z.boolean(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Kiểm tra nếu một trong các trường mật khẩu được điền thì tất cả phải được điền
      const passwordFieldsFilled = [!!data.currentPassword, !!data.newPassword, !!data.confirmPassword]
      return passwordFieldsFilled.every(Boolean) || !passwordFieldsFilled.some(Boolean)
    },
    {
      message: 'Vui lòng điền đầy đủ tất cả các trường mật khẩu',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      // Kiểm tra mật khẩu mới và xác nhận mật khẩu giống nhau
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword
      }
      return true
    },
    {
      message: 'Mật khẩu xác nhận không khớp với mật khẩu mới',
      path: ['confirmPassword'],
    }
  )

// Suy ra kiểu dữ liệu từ schema
type AccountFormValues = z.infer<typeof accountFormSchema>

// Giá trị mặc định cho form
const defaultValues: Partial<AccountFormValues> = {
  username: userData.username,
  email: userData.email,
  phone: userData.phone,
  role: userData.role,
  status: userData.status,
  twoFactorEnabled: userData.twoFactorEnabled || false,
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    toast({
      title: 'Bạn đã gửi các giá trị sau:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const isAdmin = userData.role === 'SYSADMIN' || userData.role === 'ADMIN'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='mb-4 flex flex-col space-y-2'>
          {/* <h2 className='text-2xl font-bold'>Thông tin tài khoản</h2> */}
          <div className='flex flex-wrap gap-2'>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${userData.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-800 dark:text-green-400 dark:ring-green-400/30' : 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-800 dark:text-red-400 dark:ring-red-400/30'} transition-all duration-300 ease-in-out`}>{statusOptions.find((s) => s.value === userData.status)?.label || userData.status}</span>

            <Badge variant='outline'>{roleOptions.find((r) => r.value === userData.role)?.label || userData.role}</Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {/* TÊN NGƯỜI DÙNG */}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder='Tên người dùng' {...field} readOnly={!isAdmin} />
                </FormControl>
                <FormDescription>Đây là tên người dùng duy nhất trong hệ thống.</FormDescription>
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
                  <Input type='email' placeholder='Email' {...field} />
                </FormControl>
                <FormDescription>Địa chỉ email dùng để đăng nhập và nhận thông báo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SỐ ĐIỆN THOẠI */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder='Số điện thoại' {...field} />
                </FormControl>
                <FormDescription>Dùng cho xác thực và liên lạc khi cần thiết.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VAI TRÒ */}
          {isAdmin && (
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn vai trò' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Quyết định quyền hạn của tài khoản này.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* TRẠNG THÁI */}
          {isAdmin && (
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Cho phép hoặc hạn chế quyền truy cập của tài khoản.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* THAY ĐỔI MẬT KHẨU */}
        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='text-lg font-medium'>Thay đổi mật khẩu</h3>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='sm:col-span-2'></div>

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button type='submit'>Cập nhật tài khoản</Button>
        </div>
      </form>
    </Form>
  )
}
