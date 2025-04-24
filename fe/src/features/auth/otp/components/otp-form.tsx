import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useSearch } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PinInput, PinInputField } from '@/components/common/pin-input'

//ủl file : fe/src/app/forgot-password/otp-form.tsx
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
    defaultValues: {
      otp: '',
    },
  })
  //check otp , nhập otp và gửi để verify otp
  //input : otp string + email string
  //ủl : /auth/forgot-password/verify?email=tuanvmhe173334@fpt.edu.vn&otp=573595
  // false : { "timestamp": "2025-04-22T15:11:03.557+00:00", "status": 409, "path": "/auth/forgot-password/verify", "error": "Conflict", "message": "Mã OTP không đúng", "details": {} }
  //true : { "status": 200, "sessionId": "404ddaae-647c-4f11-acfd-6c837dee5b10", "message": "Xác thực OTP thành công" }
  // verify_otp: (otp: string, email: string)
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    //TODO: Gửi otp đến mail

    toast({
      title: 'Bạn đã gửi các giá trị sau:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    setTimeout(() => {
      setIsLoading(false)
      navigate({ to: '/change-password' })
    }, 1000)
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
                    <PinInput {...field} className='flex h-10 justify-between' onComplete={() => setDisabledBtn(false)} onIncomplete={() => setDisabledBtn(true)}>
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
              Xác thực
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
