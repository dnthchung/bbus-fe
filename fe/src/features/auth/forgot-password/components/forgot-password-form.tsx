import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
// Import the ArrowLeft icon
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
  const handleBackToLogin = () => {
    navigate({ to: '/sign-in' })
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await API_SERVICES.auth.send_otp_to_mail(data.email)

      toast({
        title: 'Gửi thành công',
        description: 'Vui lòng kiểm tra email của bạn',
        variant: 'success',
      })

      setTimeout(() => {
        setIsLoading(false)
        navigate({
          to: '/otp',
          search: { email: data.email },
        })
      }, 2000)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'

      toast({
        title: 'Thất bại',
        description: errorMessage,
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
            <Button className='mt-2 w-full' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
            </Button>

            <Button variant='secondary' size='sm' onClick={handleBackToLogin} className='mt-2 w-full gap-1 text-muted-foreground hover:text-foreground' type='button'>
              <ArrowLeft size={16} />
              Quay lại đăng nhập
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
