//url file : fe/src/features/auth/forgot-password/index.tsx
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>Quên mật khẩu</h1>
          <p className='text-sm text-muted-foreground'>Chúng tôi sẽ gửi mã xác minh đến email của bạn để hỗ trợ quá trình đặt lại mật khẩu. Vui lòng nhập email bên dưới.</p>
        </div>
        <ForgotForm />
      </Card>
    </AuthLayout>
  )
}
