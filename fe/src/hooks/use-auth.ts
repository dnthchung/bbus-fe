//path : src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import apiClient from '@/lib/api-client'

export const useAuthQuery = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch user từ API `/auth/user`
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const { data } = await apiClient.get('/user')
      return data
    },
    retry: false, // Không tự động retry nếu request fail
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu 5 phút trước khi fetch lại
  })

  // Hàm logout → Gọi API và xóa cache user
  const logout = async () => {
    try {
      await apiClient.get('/auth/logout')
      queryClient.setQueryData(['authUser'], null) // Xóa cache user
      navigate({ to: '/sign-in' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return { user, isLoading, isError, logout }
}
