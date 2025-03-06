// src/features/auth/sign-in/index.tsx
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getUserIdFromToken } from '@/helpers/jwt-decode'
import { LoginCredentials } from '@/types/auth'
import { API_SERVICES } from '@/api/api-services'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API_SERVICES.auth.login(credentials)
      console.log('login - index.tsx - response', data.access_token)

      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
      localStorage.setItem('isAuthenticated', 'true')

      const token = localStorage.getItem('accessToken')
      const userId = getUserIdFromToken(token)
      console.log('Decoded userId:', userId)

      const response = await API_SERVICES.auth.fetchUser(userId)
      const user = response.data.data // Extract the 'data' field
      console.log('login - index.tsx - fetched user', response.data.data.id)

      queryClient.setQueryData(['authUser'], user) // Store the 'data' object
      navigate({ to: '/' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(errorMessage)
      console.error('Login error:', err)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isAuthenticated')
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
            Nhập số điện thoại và mật khẩu của bạn bên dưới <br /> để đăng nhập vào tài khoản của bạn
          </p>
        </div>
        <UserAuthForm onSubmit={handleLogin} isLoading={loading} error={error} />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bằng cách nhấp vào đăng nhập, bạn đồng ý với{' '}
          <a href='/terms' className='underline underline-offset-4 hover:text-primary'>
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href='/privacy' className='underline underline-offset-4 hover:text-primary'>
            Chính sách bảo mật
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
