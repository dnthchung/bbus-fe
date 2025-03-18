// path: fe/src/features/settings/profile/components/change-password-tab.tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/common/password-input'

// Tạo schema cho form đổi mật khẩu, bao gồm phoneNumber
const passwordSchema = z
  .object({
    phoneNumber: z.string().optional(), // Số điện thoại là tùy chọn, chỉ để hiển thị
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Vui lòng xác nhận lại mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp với mật khẩu mới',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ChangePasswordTab() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      phoneNumber: '0123456789', // Giả lập số điện thoại của người dùng đã đăng nhập
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  function onSubmit(data: PasswordFormValues) {
    // Gọi API đổi mật khẩu...
    toast({
      title: 'Đổi mật khẩu thành công!',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    // Reset form sau khi thành công
    form.reset({
      phoneNumber: data.phoneNumber, // Giữ số điện thoại không đổi
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* Phone Number Field (Disabled) */}
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Số điện thoại đăng nhập</FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder='Số điện thoại của bạn' aria-label='Số điện thoại' autoComplete='tel' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Current Password */}
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu hiện tại</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='****' aria-label='Mật khẩu hiện tại' autoComplete='current-password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='sm:col-span-2'></div>
          {/* New Password */}
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='****' aria-label='Mật khẩu mới' autoComplete='new-password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='****' aria-label='Xác nhận mật khẩu mới' autoComplete='new-password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end'>
          <Button type='submit'>Đổi mật khẩu</Button>
        </div>
      </form>
    </Form>
  )
}
