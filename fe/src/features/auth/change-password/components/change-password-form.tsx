//path :fe/src/features/auth/change-password/components/change-password-form.tsx
import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/common/password-input'

// Validation schema for the change password form
const passwordSchema = z
  .object({
    password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }).regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa' }).regex(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ thường' }).regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ số' }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

type ChangePasswordFormProps = HTMLAttributes<HTMLDivElement>

function ChangePasswordForm({ className, ...props }: ChangePasswordFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    console.log(data)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      navigate({ to: '/sign-in' })
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className='py-4 text-center'>
        <h3 className='mb-2 text-lg font-medium text-green-600'>Đổi mật khẩu thành công!</h3>
        <p className='mb-4 text-sm text-muted-foreground'>Mật khẩu của bạn đã được cập nhật.</p>
        <Link to='/sign-in' className='text-primary hover:underline'>
          <Button>Đăng nhập ngay</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Nhập mật khẩu mới' {...field} aria-label='password' autoComplete='current-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    {/* <Input  {...field} /> */}
                    <PasswordInput placeholder='Nhập lại mật khẩu mới' {...field} aria-label='re-password' autoComplete='current-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ChangePasswordForm
