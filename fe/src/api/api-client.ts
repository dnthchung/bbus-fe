//path : src/lib/api-client.ts
import axios, { AxiosError } from 'axios'
import { ERROR_CODES } from '@/helpers/error-code'
import { ErrorResponse } from '@/types/response/error-response'
import { useAuthStore } from '@/stores/authStore'
import { API_SERVICES } from './api-services'

// Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BBUS, // URL Backend
  withCredentials: true, // Gửi cookie HttpOnly
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${useAuthStore.getState().accessToken}`, // Gửi Access Token
  },
})

// Interceptor xử lý lỗi 401 (hết hạn Access Token)
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    // Specify the type of the error response
    const originalRequest = error.config

    // Kiểm tra lỗi 401 và xác định lý do lỗi qua errorCode
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const errorCode = error.response?.data?.errorCode

      // Nếu lỗi là do hết hạn token, thử refresh token
      if (
        errorCode === ERROR_CODES.INVALID_TOKEN ||
        errorCode === ERROR_CODES.MISSING_TOKEN
      ) {
        originalRequest._retry = true
        try {
          await API_SERVICES.auth.refresh() // Sau khi refresh thành công, retry lại request ban đầu
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Nếu refresh thất bại, gọi logout
          useAuthStore.getState().logout()
        }
      }

      // Nếu lỗi là do sai tài khoản/mật khẩu (INVALID_PASSWORD), không thực hiện refresh và reject lỗi
      if (errorCode === ERROR_CODES.INVALID_PASSWORD) {
        return Promise.reject(
          new Error('Invalid email or password. Please try again.')
        )
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
