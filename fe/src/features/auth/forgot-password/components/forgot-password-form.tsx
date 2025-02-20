// import { HTMLAttributes, useState } from 'react'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// type ForgotFormProps = HTMLAttributes<HTMLDivElement>
// const formSchema = z.object({
//   email: z
//     .string()
//     .min(1, { message: 'Please enter your email' })
//     .email({ message: 'Invalid email address' }),
// })
// export function ForgotForm({ className, ...props }: ForgotFormProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { email: '' },
//   })
//   function onSubmit(data: z.infer<typeof formSchema>) {
//     setIsLoading(true)
//     // eslint-disable-next-line no-console
//     console.log(data)
//     setTimeout(() => {
//       setIsLoading(false)
//     }, 3000)
//   }
//   return (
//     <div className={cn('grid gap-6', className)} {...props}>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className='grid gap-2'>
//             <FormField
//               control={form.control}
//               name='email'
//               render={({ field }) => (
//                 <FormItem className='space-y-1'>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder='name@example.com' {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className='mt-2' disabled={isLoading}>
//               Continue
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }
import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ForgotFormProps = HTMLAttributes<HTMLDivElement>

// Cập nhật schema validation để dùng số điện thoại thay vì email
const formSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 chữ số' })
    .max(15, { message: 'Số điện thoại không được vượt quá 15 chữ số' })
    .regex(/^\d+$/, { message: 'Số điện thoại chỉ được chứa chữ số' }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(data)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập số điện thoại' {...field} />
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
