// //path : src/lib/api-client.ts
// import axios, { AxiosError } from 'axios'
// import { ERROR_CODES } from '@/helpers/error-code'
// import { ErrorResponse } from '@/types/response/error-response'
// import { useAuthQuery } from '@/hooks/use-auth'
// import { API_SERVICES } from './api-services'
// // Khởi tạo Axios Instance
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL_BBUS, // URL Backend
//   withCredentials: true, // Gửi cookie HttpOnly
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization: `Bearer ${useAuthStore.getState().accessToken}`, // Gửi Access Token
//   },
// })
// // Interceptor to attach token to each request
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken') // Retrieve token from localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}` // Attach token to Authorization header
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )
// // Interceptor xử lý lỗi 401 (hết hạn Access Token)
// declare module 'axios' {
//   interface AxiosRequestConfig {
//     _retry?: boolean
//   }
// }
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError<ErrorResponse>) => {
//     // Specify the type of the error response
//     const originalRequest = error.config
//     // Kiểm tra lỗi 401 và xác định lý do lỗi qua errorCode
//     if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//       const errorCode = error.response?.data?.errorCode
//       // Nếu lỗi là do hết hạn token, thử refresh token
//       if (errorCode === ERROR_CODES.INVALID_TOKEN || errorCode === ERROR_CODES.MISSING_TOKEN) {
//         originalRequest._retry = true
//         try {
//           await API_SERVICES.auth.refresh() // Sau khi refresh thành công, retry lại request ban đầu
//           return apiClient(originalRequest)
//         } catch (refreshError) {
//           // Nếu refresh thất bại, gọi logout
//           useAuthQuery().logout()
//           return Promise.reject(refreshError)
//         }
//       }
//       // Nếu lỗi là do sai tài khoản/mật khẩu (INVALID_PASSWORD), không thực hiện refresh và reject lỗi
//       if (errorCode === ERROR_CODES.INVALID_PASSWORD) {
//         return Promise.reject(new Error('Invalid email or password. Please try again.'))
//       }
//     }
//     return Promise.reject(error)
//   }
// )
// export default apiClient
// src/lib/api-client.ts
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from '@/types/response/error-response'
import { API_SERVICES } from './api-services'

// Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BBUS,
  withCredentials: true, // Gửi cookie HttpOnly nếu cần (không dùng trong trường hợp này vì refresh token ở body)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to attach token to each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Extend AxiosRequestConfig to include _retry flag
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}

// Interceptor xử lý lỗi token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config

    // Kiểm tra lỗi 403 với message liên quan đến token hết hạn
    if (error.response?.status === 403 && originalRequest && !originalRequest._retry && error.response?.data?.message?.includes('JWT expired')) {
      originalRequest._retry = true

      try {
        // Gọi API refresh token
        const { data } = await API_SERVICES.auth.refresh()
        const newAccessToken = data.accessToken // Match response key
        const newRefreshToken = data.refreshToken

        // Lưu cả accessToken và refreshToken mới vào localStorage
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Cập nhật header Authorization cho request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Thử lại request ban đầu với token mới
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)

        // Nếu refresh thất bại, xóa trạng thái và redirect
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    // Nếu không phải lỗi token hết hạn, reject lỗi bình thường
    return Promise.reject(error)
  }
)

export default apiClient
