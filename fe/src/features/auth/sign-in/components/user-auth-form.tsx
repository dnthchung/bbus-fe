import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/common/password-input'
import { BusLoader } from '@/components/mine/loader/bus-loader'
import { AUTH_MESSAGES } from '@/features/auth/sign-in/data'

// 👈 import thêm

const formSchema = z.object({
  phone: z
    .string()
    .min(1, { message: 'Vui lòng nhập số điện thoại' })
    .regex(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ (bắt đầu bằng 0 và có 10 số)' }),
  password: z
    .string()
    .min(1, { message: 'Vui lòng nhập mật khẩu' })
    .refine((val) => val === 'admin' || val.length >= 6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
})

export interface UserAuthFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  onSubmit?: (data: z.infer<typeof formSchema>) => void
  isLoading?: boolean
  error?: string | null
}

export function UserAuthForm({ className, onSubmit, isLoading = false, error, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  function onSubmitHandler(data: z.infer<typeof formSchema>) {
    onSubmit?.(data)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder='0123456789' {...field} aria-label='phone' autoComplete='current-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link to='/forgot-password' className='text-sm font-medium text-muted-foreground hover:opacity-75'>
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='*****' {...field} aria-label='password' autoComplete='current-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2 flex items-center justify-center' disabled={isLoading}>
              {isLoading ? <BusLoader size='sm' showText={false} /> : 'Đăng nhập'}
            </Button>

            {error && <p className='text-sm text-red-500'>{Object.values(AUTH_MESSAGES).includes(error) ? error : AUTH_MESSAGES.UNAUTHORIZED}</p>}
          </div>
        </form>
      </Form>
    </div>
  )
}
