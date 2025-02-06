//path : src/lib/api-client.ts
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

// Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL Backend
  withCredentials: true, // Gửi cookie HttpOnly
})

// Interceptor xử lý lỗi 401 (hết hạn Access Token)
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và request chưa được retry, và không phải là request đến /auth/refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true
      try {
        await apiClient.get('/auth/refresh')
        // Sau khi refresh thành công, retry lại request ban đầu
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Nếu refresh thất bại, gọi logout (có thể xử lý thêm thông báo cho người dùng)
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
