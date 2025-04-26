'use client'

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

// path: fe/src/features/auth/otp/components/otp-form.tsx

/* ------------------------------------------------------------------ */

const OTP_LENGTH = 6

const formSchema = z.object({
  pin: z.string().length(OTP_LENGTH, { message: `Mã OTP phải gồm ${OTP_LENGTH} chữ số.` }),
})

type OtpFormProps = HTMLAttributes<HTMLDivElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const { email } = useSearch({ from: '/(auth)/otp' }) as { email: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { pin: '' },
  })

  const [isLoading, setIsLoading] = useState(false)
  const pinValue = form.watch('pin')

  const handleBack = () => {
    navigate({ to: '/forgot-password' })
  }

  /* ----------------------------- submit --------------------------- */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const res = await API_SERVICES.auth.verify_otp(data.pin, email)

      toast({
        title: 'Thành công',
        description: res.data.message ?? 'Xác thực OTP thành công',
        variant: 'success',
      })

      navigate({
        to: '/change-password',
        search: { sessionId: res.data.sessionId },
      })
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.'

      toast({
        title: 'Thất bại',
        description: errorMessage,
        variant: 'deny',
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='pin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã xác thực (OTP)</FormLabel>

                <FormControl>
                  <InputOTP maxLength={OTP_LENGTH} {...field}>
                    <InputOTPGroup className='justify-center gap-2'>
                      {[...Array(OTP_LENGTH)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} className='h-12 w-12 rounded-md border border-input bg-white text-center text-lg shadow-sm focus-visible:ring-2 focus-visible:ring-ring' />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormDescription>Vui lòng nhập mã gồm {OTP_LENGTH} chữ số được gửi tới điện thoại của bạn.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={pinValue.length !== OTP_LENGTH || isLoading} className='w-full'>
            {isLoading ? 'Đang xử lý…' : 'Xác thực'}
          </Button>

          <Button variant='secondary' size='sm' onClick={handleBack} className='w-full gap-1 text-muted-foreground hover:text-foreground' type='button'>
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </form>
      </Form>
    </div>
  )
}
