import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Quên mật khẩu
          </h1>
          <p className='text-sm text-muted-foreground'>
            Nhập email đã đăng ký của bạn và <br /> chúng tôi sẽ gửi cho bạn một
            liên kết để đặt lại mật khẩu của bạn.
          </p>
        </div>
        <ForgotForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bạn không có tài khoản?{' '}
          <Link
            to='/sign-up'
            className='underline underline-offset-4 hover:text-primary'
          >
            Đăng ký
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
