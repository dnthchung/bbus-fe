import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <div className='flex flex-col items-center space-y-2 text-center'>
        <span className='text-4xl'>🔐</span>
        <h1 className='text-2xl font-semibold tracking-tight'>Quên mật khẩu</h1>
        <p className='text-sm text-muted-foreground'>
          Chúng tôi sẽ gửi mã xác minh đến email của bạn để hỗ trợ quá trình đặt lại mật khẩu.
          <br />
          Vui lòng nhập email bên dưới.
        </p>
      </div>

      <ForgotForm />

      <p className='px-4 pt-2 text-center text-sm text-muted-foreground'>Liên hệ quản trị viên nếu bạn không nhận được mã xác minh.</p>
    </AuthLayout>
  )
}

// //url file : fe/src/features/auth/forgot-password/index.tsx
// import { Card } from '@/components/ui/card'
// import AuthLayout from '../auth-layout'
// import { ForgotForm } from './components/forgot-password-form'

// export default function ForgotPassword() {
//   return (
//     <AuthLayout>
//       <Card className='p-6'>
//         <div className='mb-2 flex flex-col space-y-2 text-left'>
//           <h1 className='text-md font-semibold tracking-tight'>Quên mật khẩu</h1>
//           <p className='text-sm text-muted-foreground'>Chúng tôi sẽ gửi mã xác minh đến email của bạn để hỗ trợ quá trình đặt lại mật khẩu. Vui lòng nhập email bên dưới.</p>
//         </div>
//         <ForgotForm />
//       </Card>
//     </AuthLayout>
//   )
// }
