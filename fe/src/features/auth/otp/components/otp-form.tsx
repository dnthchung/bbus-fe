'use client'

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PinInput, PinInputField } from '@/components/common/pin-input'

type OtpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Vui lòng nhập mã OTP.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const { email } = useSearch({ from: '/(auth)/otp' }) as { email: string }

  const [isLoading, setIsLoading] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const handleComplete = () => {
    if (disabledBtn) setDisabledBtn(false)
  }

  const handleIncomplete = () => {
    if (!disabledBtn) setDisabledBtn(true)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const res = await API_SERVICES.auth.verify_otp(data.otp, email)

      toast({
        title: 'Thành công',
        description: res.data.message || 'Xác thực OTP thành công',
        variant: 'success',
      })

      setTimeout(() => {
        navigate({ to: '/change-password', search: { sessionId: res.data.sessionId } })
      }, 1000)
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
              name='otp'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <PinInput {...field} className='flex h-10 justify-between' onComplete={handleComplete} onIncomplete={handleIncomplete}>
                      {Array.from({ length: 7 }, (_, i) => {
                        if (i === 3) return <Separator key={i} orientation='vertical' />
                        return <PinInputField key={i} component={Input} className={`${form.getFieldState('otp').invalid ? 'border-red-500' : ''}`} />
                      })}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={disabledBtn || isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác thực'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
