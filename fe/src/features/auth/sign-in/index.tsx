'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getTimeGreeting } from '@/helpers/get-time-greeting.ts'
import { getUserIdFromToken } from '@/helpers/jwt-decode'
import { LoginCredentials } from '@/types/auth'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { AdvancedBusLoader } from '@/components/mine/loader/advanced-bus-loader'
import { AUTH_MESSAGES } from '@/features/auth/sign-in/data.ts'
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
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
      localStorage.setItem('isAuthenticated', 'true')

      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('Không tìm thấy token!')
      const userId = getUserIdFromToken(token)
      if (!userId) throw new Error('Không thể lấy userId từ token!')

      const response = await API_SERVICES.auth.fetchUser(userId)
      const user = response.data.data
      queryClient.setQueryData(['authUser'], user)

      toast({
        variant: 'success',
        title: 'Đăng nhập thành công!!',
        description: `${getTimeGreeting()}, ${user.name}.`,
      })

      navigate({ to: '/' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(errorMessage)

      toast({
        title: 'Đăng nhập thất bại',
        description: AUTH_MESSAGES.LOGIN_FAILED,
        variant: 'deny',
      })

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isAuthenticated')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex h-svh w-full items-center justify-center bg-cover bg-center' style={{ backgroundImage: `url('/images/9.jpg')` }}>
      {loading && <AdvancedBusLoader size='full' animation='drive' variant='default' text='Đang đăng nhập...' />}

      <div className='mx-auto w-full max-w-md space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur-md'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <span className='text-4xl'>👋</span>
          <h1 className='text-2xl font-semibold tracking-tight'>Bbus - Đăng nhập</h1>
          <p className='text-sm text-muted-foreground'>
            Nhập số điện thoại và mật khẩu dưới đây <br />
            để đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <UserAuthForm onSubmit={handleLogin} isLoading={loading} error={error} />

        <p className='px-4 text-center text-sm text-muted-foreground'>
          Bằng cách nhấn vào đăng nhập, bạn đồng ý với{' '}
          <a href='/term' className='underline underline-offset-4 hover:text-primary'>
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href='/privacy' className='underline underline-offset-4 hover:text-primary'>
            Chính sách bảo mật
          </a>
          .
        </p>
      </div>
    </div>
  )
}
