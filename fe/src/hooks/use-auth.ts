// // src/hooks/use-auth.ts
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { useNavigate } from '@tanstack/react-router'
// import { getUserIdFromToken } from '@/helpers/jwt-decode'
// import { API_SERVICES } from '@/api/api-services'
// // Define the AuthUser interface based on the nested 'data' object
// interface AuthUser {
//   id: number
//   name: string
//   email: string
//   phone: string
//   address: string
//   avatar: string
//   dob: string
//   gender: string
//   roles: string[] | null
//   status: string | null
//   username: string | null
// }
// // Define the full API response structure
// interface FetchUserResponse {
//   status: number
//   message: string
//   data: AuthUser
// }
// export const useAuthQuery = () => {
//   const queryClient = useQueryClient()
//   const navigate = useNavigate()
//   // Determine authentication state from localStorage
//   const isAuthenticated = !!localStorage.getItem('isAuthenticated')
//   const token = localStorage.getItem('accessToken')
//   let userId: string | null = null
//   try {
//     userId = token ? getUserIdFromToken(token) : null
//   } catch (error) {
//     console.error('Failed to decode token in useAuthQuery:', error)
//     localStorage.removeItem('accessToken')
//     localStorage.removeItem('refreshToken')
//     localStorage.removeItem('isAuthenticated')
//     navigate({ to: '/sign-in' })
//   }
//   // console.log('Decoded userId (use-auth):', userId)
//   // Declare logout before use
//   const logout = async () => {
//     try {
//       // await API_SERVICES.auth.logout()
//       queryClient.setQueryData(['authUser'], null)
//       queryClient.cancelQueries({ queryKey: ['authUser'] })
//       localStorage.removeItem('accessToken')
//       localStorage.removeItem('refreshToken')
//       localStorage.removeItem('isAuthenticated')
//       // navigate({ to: '/sign-in' })
//       // window.location.href = '/sign-in' // Reload the
//       console.log('Logging out...')
//     } catch (error) {
//       console.error('Logout error:', error)
//     }
//   }
//   const {
//     data: user,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<AuthUser>({
//     queryKey: ['authUser'],
//     queryFn: async () => {
//       if (!userId) throw new Error('No valid user ID')
//       // console.log('Fetching user from API /auth/user... (use-auth hook)')
//       const response: FetchUserResponse = await API_SERVICES.auth.fetchUser(userId)
//       // console.log('Fetched user data - 123:', response.data)
//       return response.data
//     },
//     enabled: isAuthenticated && !!userId,
//     retry: false,
//     staleTime: 5 * 60 * 1000,
//   })
//   // Handle token expiration error
//   if (isError && error instanceof Error && error.message.includes('JWT expired')) {
//     console.error('JWT expired detected in useAuthQuery, logging out...')
//     logout()
//   }
//   return { user, isAuthenticated, isLoading, isError, logout }
// }
// src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getUserIdFromToken } from '@/helpers/jwt-decode'
import { API_SERVICES } from '@/api/api-services'

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
  roles: string[] | null
  status: string | null
  username: string | null
}

// Định nghĩa kiểu trả về đầy đủ của API
interface FetchUserResponse {
  status: number
  message: string
  data: AuthUser
}

export const useAuthQuery = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // 1. Lấy trạng thái từ localStorage
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')
  const token = localStorage.getItem('accessToken')

  let userId: string | null = null
  try {
    userId = token ? getUserIdFromToken(token) : null
  } catch (error) {
    console.error('Failed to decode token in useAuthQuery:', error)
    // Token hỏng hoặc decode lỗi → clear & điều hướng
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isAuthenticated')
    navigate({ to: '/sign-in' })
  }

  // 2. Định nghĩa hàm logout
  const logout = async () => {
    try {
      // Gọi API logout nếu có backend cho phép, nếu không thì chỉ xoá localStorage
      // await API_SERVICES.auth.logout()
      queryClient.setQueryData(['authUser'], null)
      queryClient.cancelQueries({ queryKey: ['authUser'] })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isAuthenticated')

      // Tuỳ chiến lược điều hướng:
      // navigate({ to: '/sign-in' })
      // hoặc reload trang:
      // window.location.href = '/sign-in'
      console.log('Logging out...')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 3. Sử dụng React Query để fetch thông tin user
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<AuthUser>({
    queryKey: ['authUser'],
    // Hàm fetch user
    queryFn: async () => {
      if (!userId) {
        throw new Error('No valid user ID')
      }
      const response: FetchUserResponse = await API_SERVICES.auth.fetchUser(userId)
      return response.data
    },
    enabled: isAuthenticated && !!userId, // chỉ fetch khi có token + userId
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // 4. Kiểm tra lỗi token hết hạn → tự động logout
  if (isError && error instanceof Error && error.message.includes('JWT expired')) {
    console.error('JWT expired detected in useAuthQuery, logging out...')
    logout()
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    logout,
  }
}
