// // src/hooks/use-auth.ts
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { useNavigate } from '@tanstack/react-router'
// import { getUserIdFromToken } from '@/helpers/jwt-decode'
// import { API_SERVICES } from '@/api/api-services'
// import { toast } from '@/hooks/use-toast.ts'
// import {getTimeGreeting} from '@/helpers/get-time-greeting.ts'

// // Định nghĩa kiểu AuthUser dựa trên cấu trúc trả về từ API
// interface AuthUser {
//   id: number
//   name: string
//   email: string
//   phone: string
//   address: string
//   avatar: string
//   dob: string
//   gender: string
//   role: string | null
//   status: string | null
//   username: string | null
// }

// // Định nghĩa kiểu trả về đầy đủ của API
// interface FetchUserResponse {
//   data: {
//     status: number
//     message: string
//     data: AuthUser
//   }
// }

// export const useAuthQuery = () => {
//   const queryClient = useQueryClient()
//   const navigate = useNavigate()

//   // Lấy thông tin từ localStorage
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

//   // Hàm logout
//   const logout = async () => {
//     try {
//       queryClient.setQueryData(['authUser'], null)
//       queryClient.cancelQueries({ queryKey: ['authUser'] })
//       localStorage.removeItem('accessToken')
//       localStorage.removeItem('refreshToken')
//       localStorage.removeItem('isAuthenticated')
//       toast({
//         variant: "success",
//         title: "Đăng xuất thành công",
//         description: "Bạn đã đăng xuất khỏi hệ thống.",
//       })
//       navigate({ to: '/sign-in' })
//       // window.location.href = '/sign-in'
//     } catch (error) {
//       console.error('Logout error:', error)
//     }
//   }

//   // Fetch user với React Query
//   const {
//     data: user,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<AuthUser>({
//     queryKey: ['authUser', userId],
//     queryFn: async () => {
//       if (!userId) {
//         throw new Error('No valid user ID')
//       }
//       const response: FetchUserResponse = await API_SERVICES.auth.fetchUser(userId)
//       const userData = response.data.data

//       // Check if user has valid role
//       if (!userData.role?.includes('SYSADMIN') && !userData.role?.includes('ADMIN')) {
//         console.error('Role không hợp lệ' + userData.role)
//         // Remove auth data
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         localStorage.removeItem('isAuthenticated')
        
//         // Show error message
//         toast({
//           variant: "destructive",
//           title: "Từ chối truy cập",
//           description: "Tài khoản của bạn không có quyền truy cập hệ thống.",
//         })
        
//         // Redirect to sign in
//         // window.location.href = '/sign-in'
//         navigate({ to: '/sign-in' })
//         throw new Error('Unauthorized role')
//       }

//       console.log('đăng nhập thành công:'  +  userData.role)
//       toast({
//         variant: "success",
//         title: "Đăng nhập thành công!!",
//         description: `${getTimeGreeting()}, ${userData.name}.`,
//       });

//       return userData
//     },
//     enabled: isAuthenticated && !!userId, 
//     retry: false,
//     staleTime: 5 * 60 * 1000,
//   })

//   // Xử lý lỗi token hết hạn
//   if (isError && error instanceof Error && error.message.includes('JWT expired')) {
//     // console.error('JWT expired detected, logging out...')
//     toast({
//       variant: "deny",
//       title: "Từ chối truy cập",
//       description: "Phiên đăng nhập đã hết hạn.",
//     })
//     logout()
//   }

//   return { user, isAuthenticated, isLoading, isError, logout }
// }

// src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getUserIdFromToken } from '@/helpers/jwt-decode'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast.ts'
import { getTimeGreeting } from '@/helpers/get-time-greeting.ts'
import React, { useEffect } from 'react'

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

// Mảng các role được phép truy cập
const ALLOWED_ROLES = ['SYSADMIN', 'ADMIN']

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
    // Xử lý lỗi token không hợp lệ một cách "yên tĩnh" tại đây
    // không redirect ngay tại đây
  }

  // Hàm logout
  const logout = () => {
    queryClient.setQueryData(['authUser'], null)
    queryClient.cancelQueries({ queryKey: ['authUser'] })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isAuthenticated')
    
    toast({
      variant: "success",
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống.",
    })
    
    navigate({ to: '/sign-in' })
  }

  // Kiểm tra role có hợp lệ không
  const hasValidRole = (role: string | null): boolean => {
    if (!role) return false
    return ALLOWED_ROLES.some(allowedRole => role.includes(allowedRole))
  }

  // Fetch user với React Query
  const { data: user, isLoading, isError, error } = useQuery<AuthUser | null>({
    queryKey: ['authUser', userId],
    queryFn: async () => {
      if (!userId) {
        return null // Trả về null thay vì throw error
      }
      
      try {
        const response: FetchUserResponse = await API_SERVICES.auth.fetchUser(userId)
        return response.data.data
      } catch (err) {
        console.error('Error fetching user:', err)
        return null // Trả về null nếu có lỗi
      }
    },
    enabled: isAuthenticated && !!userId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Xử lý các trường hợp role không hợp lệ hoặc token hết hạn
 useEffect(() => {
    // Kiểm tra token đã hết hạn
    if (isError && error instanceof Error && error.message.includes('JWT expired')) {
      toast({
        variant: "deny",
        title: "Từ chối truy cập",
        description: "Phiên đăng nhập đã hết hạn.",
      })
      logout()
      return
    }
    
    // Chỉ hiển thị toast chào mừng khi user có dữ liệu hợp lệ và có role hợp lệ
    if (user && hasValidRole(user.role)) {
      toast({
        variant: "success",
        title: "Đăng nhập thành công!!",
        description: `${getTimeGreeting()}, ${user.name}.`,
      })
      return
    }
    
    // Xử lý trường hợp user không có quyền
    if (user && !hasValidRole(user.role)) {
      toast({
        variant: "deny",
        title: "Từ chối truy cập",
        description: "Tài khoản của bạn không có quyền truy cập hệ thống.",
      })
      logout()
    }
  }, [user, isError, error])

  // Thêm hook để chuyển hướng user nếu họ không có quyền hoặc không xác thực
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoading, isAuthenticated, navigate])

  return {
    user,
    isAuthenticated: isAuthenticated && !!user && hasValidRole(user?.role),
    isLoading,
    isError,
    logout
  }
}