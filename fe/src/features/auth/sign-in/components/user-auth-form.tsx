//path : src/features/auth/sign-in/components/user-auth-form.tsx
// import { HTMLAttributes } from 'react'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Link } from '@tanstack/react-router'
// // import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
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
// import { PasswordInput } from '@/components/common/password-input'
// // Define the validation schema using zod
// const formSchema = z.object({
//   phoneNumber: z
//     .string()
//     .min(1, { message: 'Vui lòng nhập số điện thoại' })
//     .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự' }),
//   email: z
//     .string()
//     .min(1, { message: 'Vui lòng nhập email' })
//     .email({ message: 'Địa chỉ email không hợp lệ' }),
//   password: z
//     .string()
//     .min(1, { message: 'Vui lòng nhập mật khẩu' })
//     .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
// })
// // Omit the native onSubmit from HTMLAttributes to avoid type conflicts
// export interface UserAuthFormProps
//   extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
//   onSubmit?: (data: z.infer<typeof formSchema>) => void
//   isLoading?: boolean
//   error?: string | null
// }
// export function UserAuthForm({
//   className,
//   onSubmit,
//   isLoading = false,
//   error,
//   ...props
// }: UserAuthFormProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       phoneNumber: '',
//       email: '',
//       password: '',
//     },
//   })
//   // This handler wraps the custom onSubmit prop (if provided)
//   function onSubmitHandler(data: z.infer<typeof formSchema>) {
//     if (onSubmit) {
//       onSubmit(data)
//     } else {
//       console.log(data)
//     }
//   }
//   return (
//     // Spread only non-custom props onto the container div
//     <div className={cn('grid gap-6', className)} {...props}>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmitHandler)}>
//           <div className='grid gap-2'>
//             <FormField
//               control={form.control}
//               name='phoneNumber'
//               render={({ field }) => (
//                 <FormItem className='space-y-1'>
//                   <FormLabel>Số điện thoại</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder='0123456789'
//                       {...field}
//                       aria-label='phoneNumber'
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
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
//             <FormField
//               control={form.control}
//               name='password'
//               render={({ field }) => (
//                 <FormItem className='space-y-1'>
//                   <div className='flex items-center justify-between'>
//                     <FormLabel>Mật khẩu</FormLabel>
//                     <Link
//                       to='/forgot-password'
//                       className='text-sm font-medium text-muted-foreground hover:opacity-75'
//                     >
//                       Quên mật khẩu?
//                     </Link>
//                   </div>
//                   <FormControl>
//                     <PasswordInput placeholder='**' {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className='mt-2' disabled={isLoading}>
//               Đăng nhập
//             </Button>
//             {error && <p className='text-sm text-red-500'>{error}</p>}
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }
// Path: src/features/auth/sign-in/components/user-auth-form.tsx
import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
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
import { PasswordInput } from '@/components/common/password-input'

// ✅ Define the validation schema using zod (only phoneNumber and password)
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: 'Vui lòng nhập số điện thoại' })
    .regex(/^0\d{9}$/, {
      message: 'Số điện thoại không hợp lệ (bắt đầu bằng 0 và có 10 số)',
    }),
  password: z
    .string()
    .min(1, { message: 'Vui lòng nhập mật khẩu' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
})

// ✅ Omit the native onSubmit from HTMLAttributes to avoid type conflicts
export interface UserAuthFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  onSubmit?: (data: z.infer<typeof formSchema>) => void
  isLoading?: boolean
  error?: string | null
}

export function UserAuthForm({
  className,
  onSubmit,
  isLoading = false,
  error,
  ...props
}: UserAuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  })

  // ✅ Handle form submission
  function onSubmitHandler(data: z.infer<typeof formSchema>) {
    if (onSubmit) {
      onSubmit(data)
    } else {
      console.log(data)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className='grid gap-2'>
            {/* ✅ Phone Number Field */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='0123456789'
                      {...field}
                      aria-label='phone number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Password Field */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder='*****'
                      {...field}
                      aria-label='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Submit Button */}
            <Button className='mt-2' disabled={isLoading}>
              Đăng nhập
            </Button>

            {/* ✅ Error Message */}
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
        </form>
      </Form>
    </div>
  )
}
