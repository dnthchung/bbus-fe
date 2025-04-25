//path: fe/src/features/auth/otp/index.tsx
import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { OtpForm } from './components/otp-form'

export default function Otp() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>Xác thực hai yếu tố</h1>
          <p className='text-sm text-muted-foreground'>
            Vui lòng nhập mã xác thực. <br /> Chúng tôi đã gửi mã xác thực đến email
          </p>
        </div>
        <OtpForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bạn chưa nhận được?{' '}
          <Link to='/sign-in' className='underline underline-offset-4 hover:text-primary'>
            Gửi lại mã mới.
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
