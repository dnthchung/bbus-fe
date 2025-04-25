import { Link } from '@tanstack/react-router'
import AuthLayout from '../auth-layout'
import ChangePasswordForm from './components/change-password-form'

export default function ChangePassword() {
  return (
    <AuthLayout>
      <div className='flex flex-col items-center space-y-2 text-center'>
        <span className='text-4xl'>🔒</span>
        <h1 className='text-2xl font-semibold tracking-tight'>Tạo mật khẩu mới</h1>
        <p className='text-sm text-muted-foreground'>Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
      </div>

      <ChangePasswordForm />

      <p className='pt-2 text-center text-sm text-muted-foreground'>
        <Link to='/sign-in' className='underline underline-offset-4 hover:text-primary'>
          Quay lại đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}

// //file url :  fe/src/features/auth/change-password/index.tsx
// import { Link } from '@tanstack/react-router'
// import { Card } from '@/components/ui/card'
// import ChangePasswordForm from '@/features/auth/change-password/components/change-password-form'
// import AuthLayout from '../auth-layout'

// export default function ChangePassword() {
//   return (
//     <AuthLayout>
//       <Card className='p-6'>
//         <div className='mb-4 flex flex-col space-y-2 text-left'>
//           <h1 className='text-md font-semibold tracking-tight'>Tạo mật khẩu mới</h1>
//           <p className='text-sm text-muted-foreground'>Vui lòng nhập mật khẩu mới của bạn. Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
//         </div>
//         <ChangePasswordForm />
//         <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
//           <Link to='/sign-in' className='underline underline-offset-4 hover:text-primary'>
//             Quay lại đăng nhập
//           </Link>
//         </p>
//       </Card>
//     </AuthLayout>
//   )
// }
