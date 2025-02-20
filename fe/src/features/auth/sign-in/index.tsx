//path: src/features/auth/sign-in/index.tsx
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LoginCredentials } from '@/types/auth'
import { API_SERVICES } from '@/api/api-services'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient() // Sử dụng queryClient
  // const { fetchUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      // Gọi API login
      const { data } = await API_SERVICES.auth.login(credentials)
      console.log('login - index.tsx - response', data)
      // Lưu accessToken vào localStorage (nếu cần)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('isAuthenticated', 'true')
      // Gọi API lấy thông tin user ngay sau khi login
      const { data: user } = await API_SERVICES.auth.fetchUser()
      console.log('login - index.tsx - fetched user', user)
      // Cập nhật React Query Cache
      queryClient.setQueryData(['authUser'], user)
      // Cập nhật Zustand store
      useAuthStore.setState({ user, isAuthenticated: true })
      // Điều hướng về trang chủ
      navigate({ to: '/' })
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Đăng nhập</h1>
          <p className='text-sm text-muted-foreground'>
            Nhập số điện thoại và mật khẩu của bạn bên dưới <br /> để đăng nhập
            vào tài khoản của bạn
          </p>
        </div>
        {/* Pass our custom onSubmit, isLoading and error to the form */}
        <UserAuthForm
          onSubmit={handleLogin}
          isLoading={loading}
          error={error}
        />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bằng cách nhấp vào đăng nhập, bạn đồng ý với{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Điều khoản dịch vụ
            {/* Terms of Service */}
          </a>{' '}
          và{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Chính sách bảo mật
            {/* Privacy Policy */}
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
