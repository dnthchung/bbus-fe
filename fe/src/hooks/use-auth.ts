//path : src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { useAuthStore } from '@/stores/authStore'

// ✅ Import API gộp

export const useAuthQuery = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  // Fetch user từ API `/auth/user`
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const { data } = await API_SERVICES.auth.fetchUser()
      return data
    },
    enabled: isAuthenticated, // Chỉ fetch khi user đã login
    retry: false, // Không tự động retry nếu request fail
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu 5 phút trước khi fetch lại
  })

  // Hàm logout → Gọi API và xóa cache user
  const logout = async () => {
    try {
      await API_SERVICES.auth.logout()
      queryClient.setQueryData(['authUser'], null) // Xóa cache user
      queryClient.cancelQueries({ queryKey: ['authUser'] }) // Hủy request đang chờ
      navigate({ to: '/sign-in' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return { user, isLoading, isError, logout }
}
