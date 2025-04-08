// src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getUserIdFromToken } from '@/helpers/jwt-decode'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast.ts'

// Định nghĩa kiểu AuthUser dựa trên cấu trúc trả về từ API
interface AuthUser {
  id: number
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  dob: string
  gender: string
  role: string | null
  status: string | null
  username: string | null
}

// Định nghĩa kiểu trả về đầy đủ của API
interface FetchUserResponse {
  data: {
    status: number
    message: string
    data: AuthUser
  }
}

export const useAuthQuery = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Lấy thông tin từ localStorage
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')
  const token = localStorage.getItem('accessToken')
  let userId: string | null = null

  try {
    userId = token ? getUserIdFromToken(token) : null
  } catch (error) {
    console.error('Failed to decode token in useAuthQuery:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isAuthenticated')
    navigate({ to: '/sign-in' })
  }

  // Hàm logout
  const logout = async () => {
    try {
      queryClient.setQueryData(['authUser'], null)
      queryClient.cancelQueries({ queryKey: ['authUser'] })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isAuthenticated')
      toast({
        variant: 'success',
        title: 'Đăng xuất thành công',
        description: 'Bạn đã đăng xuất khỏi hệ thống.',
      })
      navigate({ to: '/sign-in' })
      // window.location.href = '/sign-in'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Fetch user với React Query
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<AuthUser>({
    queryKey: ['authUser', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No valid user ID')
      }
      const response: FetchUserResponse = await API_SERVICES.auth.fetchUser(userId)
      const userData = response.data.data

      // Check if user has valid role
      if (!userData.role?.includes('SYSADMIN') && !userData.role?.includes('ADMIN')) {
        console.error('----- Role không hợp lệ: ' + userData.role)
        // Remove auth data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('isAuthenticated')

        // Show error message
        toast({
          variant: 'deny',
          title: 'Từ chối truy cập',
          description: 'Tài khoản của bạn không có quyền truy cập hệ thống.',
        })

        // Redirect to sign in
        // window.location.href = '/sign-in'
        navigate({ to: '/sign-in' })
        throw new Error('Unauthorized role')
      }
      console.log('User data: =>', userData.role)
      return userData
    },
    enabled: isAuthenticated && !!userId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Xử lý lỗi token hết hạn
  if (isError && error instanceof Error && error.message.includes('JWT expired')) {
    // console.error('JWT expired detected, logging out...')
    toast({
      variant: 'deny',
      title: 'Từ chối truy cập',
      description: 'Phiên đăng nhập đã hết hạn.',
    })
    logout()
  }

  return { user, isAuthenticated, isLoading, isError, logout }
}
