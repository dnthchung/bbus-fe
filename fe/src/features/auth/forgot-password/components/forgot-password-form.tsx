import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

//file url : fe/src/app/forgot-password/forgot-password-form.tsx
type ForgotFormProps = HTMLAttributes<HTMLDivElement>

// ✅ Dùng lại schema email
const formSchema = z.object({
  email: z.string().min(1, { message: 'Vui lòng nhập email' }).email({ message: 'Email không hợp lệ' }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      console.log(data)
      const res = await API_SERVICES.auth.send_otp_to_mail(data.email)
      toast({
        title: 'Gửi thành công',
        description: 'Vui lòng kiểm tra email của bạn',
        variant: 'success',
      })

      setTimeout(() => {
        setIsLoading(false)
        navigate({ to: '/otp' })
      }, 3000)
    } catch (error) {
      // setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra')
      toast({
        title: 'Có lỗi xảy ra : ' + error,
        description: 'Vui lòng thử lại.',
        variant: 'deny',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
