//path : src/lib/api-client.ts
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

// Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL Backend
  withCredentials: true, // Gửi cookie HttpOnly
})

// Interceptor xử lý lỗi 401 (hết hạn Access Token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await apiClient.get('/auth/refresh') // Gọi API Refresh Token
        return apiClient(error.config!) // Thử lại request cũ
      } catch (refreshError) {
        useAuthStore.getState().logout() // Nếu Refresh Token hết hạn → logout
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
