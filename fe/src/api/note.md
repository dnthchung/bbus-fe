// // src/lib/api-client.ts
// import axios, { AxiosError } from 'axios'
// import { ErrorResponse } from '@/types/response/error-response'
// import { API_SERVICES } from './api-services'
// // Khởi tạo Axios Instance
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL_BBUS,
//   withCredentials: true, // Gửi cookie HttpOnly nếu cần (không dùng trong trường hợp này vì refresh token ở body)
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })
// // Interceptor to attach token to each request
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )
// // Extend AxiosRequestConfig to include _retry flag
// declare module 'axios' {
//   interface AxiosRequestConfig {
//     _retry?: boolean
//   }
// }
// // Interceptor xử lý lỗi token hết hạn
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError<ErrorResponse>) => {
//     const originalRequest = error.config
//     // Kiểm tra lỗi 403 với message liên quan đến token hết hạn
//     if (error.response?.status === 403 && originalRequest && !originalRequest._retry && error.response?.data?.message?.includes('JWT expired')) {
//       originalRequest._retry = true
//       try {
//         // Gọi API refresh token
//         const { data } = await API_SERVICES.auth.refresh()
//         const newAccessToken = data.accessToken // Match response key
//         const newRefreshToken = data.refreshToken
//         console.log('api-client - refresh token process')
//         // Lưu cả accessToken và refreshToken mới vào localStorage
//         localStorage.setItem('accessToken', newAccessToken)
//         localStorage.setItem('refreshToken', newRefreshToken)
//         // Cập nhật header Authorization cho request gốc
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//         // Thử lại request ban đầu với token mới
//         return apiClient(originalRequest)
//       } catch (refreshError) {
//         console.error('Refresh token failed:', refreshError)
//         // Nếu refresh thất bại, xóa trạng thái và redirect
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         localStorage.removeItem('isAuthenticated')
//         window.location.href = '/sign-in'
//         return Promise.reject(refreshError)
//       }
//     }
//     // Nếu không phải lỗi token hết hạn, reject lỗi bình thường
//     return Promise.reject(error)
//   }
// )
// export default apiClient
// // src/lib/api-client.ts
// import axios, { AxiosError } from 'axios'
// import { ErrorResponse } from '@/types/response/error-response'
// import { API_SERVICES } from './api-services'
// // Tạo Axios Instance
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL_BBUS,
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
// })
// // Interceptor gắn token vào header
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )
// // Mở rộng AxiosRequestConfig để bổ sung _retry
// declare module 'axios' {
//   interface AxiosRequestConfig {
//     _retry?: boolean
//   }
// }
// // Interceptor xử lý response
// apiClient.interceptors.response.use(
//   (response) => {
//     // BƯỚC 1: Kiểm tra body trả về
//     const data = response.data
//     // Giả sử BE trả về dạng:
//     // {
//     //   "timestamp": "...",
//     //   "status": 403,
//     //   "path": "/user/list",
//     //   "error": "Forbidden",
//     //   "message": "Access denied: JWT expired ..."
//     // }
//     // Nếu data.status >= 400, ta "tự ném" lỗi để xuống nhánh catch
//     if (data?.status >= 400) {
//       // Tạo lỗi custom, gán thêm response để bên dưới có thể xử lý
//       console.error('Custom Error')
//       const customError = new Error(data.message || 'Unknown error')
//       ;(customError as any).response = {
//         status: data.status,
//         data: data,
//       }
//       throw customError
//     }
//     // Nếu status < 400 thì coi như success
//     return response
//   },
//   async (error: AxiosError<ErrorResponse>) => {
//     // BƯỚC 2: Nhánh error interceptor
//     const originalRequest = error.config
//     const errorStatus = error.response?.status
//     const errorData = error.response?.data
//     console.error('Original Request:', originalRequest)
//     console.error('Error Status:', errorStatus)
//     console.error('Error Data:', errorData)
//     // Kiểm tra lỗi 403 với message liên quan đến token hết hạn
//     if (errorStatus === 403 && originalRequest && !originalRequest._retry && errorData?.message?.includes('JWT expired')) {
//       originalRequest._retry = true
//       try {
//         // Gọi API refresh token
//         const { data } = await API_SERVICES.auth.refresh()
//         const newAccessToken = data.accessToken
//         const newRefreshToken = data.refreshToken
//         // Lưu token mới
//         localStorage.setItem('accessToken', newAccessToken)
//         localStorage.setItem('refreshToken', newRefreshToken)
//         // Gắn token mới vào header
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//         // Thử lại request ban đầu
//         return apiClient(originalRequest)
//       } catch (refreshError) {
//         console.error('Refresh token failed:', refreshError)
//         // Nếu refresh thất bại -> xóa token -> redirect
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         localStorage.removeItem('isAuthenticated')
//         window.location.href = '/sign-in'
//         return Promise.reject(refreshError)
//       }
//     }
//     // Nếu không phải lỗi 403 hoặc không thể refresh, trả tiếp về cho caller
//     return Promise.reject(error)
//   }
// )
// export default apiClient
// src/lib/api-client.ts
import axios, { AxiosError } from 'axios'
// import { ErrorResponse } from '@/types/response/error-response'
import { API_SERVICES } from './api-services'

// 1) Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BBUS,
  withCredentials: true, // If you need cookies, else remove
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2) Attach token to each request
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

// 3) Extend AxiosRequestConfig to include _retry flag
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}

// 4) Response interceptor
// apiClient.interceptors.response.use(
//   // --- SUCCESS CASE ---
//   (response) => {
//     /*
//       Because the backend sometimes returns HTTP 200 but the body itself has:
//         {
//           status: 403,
//           message: "Access denied: JWT expired...",
//           ...
//         }
//       we treat this as an error by throwing.
//     */
//     const data = response.data
//     if (data?.status >= 400) {
//       const customError = new Error(data.message || 'Unknown error')
//       // Attach the status and data on the error, so the error interceptor sees them
//       ;(customError as any).response = {
//         status: data.status,
//         data: data,
//       }
//       throw customError
//     }

//     // If data.status < 400, treat as success
//     return response
//   },

//   // --- ERROR CASE ---
//   async (error: AxiosError<ErrorResponse>) => {
//     const originalRequest = error.config
//     const errorStatus = error.response?.status
//     const errorData = error.response?.data
//     console.log('Original Request:', originalRequest)
//     console.log('Error Status:', errorStatus)
//     console.log('Error Data:', errorData)

//     // Example: If we detect "JWT expired" (403) in the "body-level" error
//     if (errorStatus === 403 && originalRequest && !originalRequest._retry && errorData?.message?.includes('JWT expired')) {
//       originalRequest._retry = true
//       try {
//         // Attempt refresh
//         const { data } = await API_SERVICES.auth.refresh()
//         const newAccessToken = data.accessToken
//         const newRefreshToken = data.refreshToken

//         // Update localStorage
//         localStorage.setItem('accessToken', newAccessToken)
//         localStorage.setItem('refreshToken', newRefreshToken)

//         // Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//         return apiClient(originalRequest)
//       } catch (refreshError) {
//         // Refresh failed -> remove tokens + redirect
//         console.error('Refresh token failed:', refreshError)
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         localStorage.removeItem('isAuthenticated')
//         window.location.href = '/sign-in'
//         return Promise.reject(refreshError)
//       }
//     }

//     // If not a token-expiration case, reject normally
//     return Promise.reject(error)
//   }
// )

apiClient.interceptors.response.use(
  // ---------------------------
  //          SUCCESS
  // ---------------------------
  (response) => {
    const data = response.data

    // 1) Nếu BE trả về HTTP 200, nhưng body `status = 403` + "JWT expired"
    if (data?.status === 403 && data?.message?.includes('JWT expired')) {
      // 2) Giả lập lỗi 403 để ném sang khối error
      // const customError = new Error(data.message || 'JWT expired - Giả lập lỗi 403 để ném sang khối error')
      const customError = new Error('=== JWT expired - Giả lập lỗi 403 để ném sang khối error ===')

      ;(customError as any).response = {
        status: 403,
        data: data,
      }
      throw customError
    }

    // 3) Hoặc, bạn vẫn có trường hợp status >= 400 => ném lỗi
    if (data?.status >= 400) {
      const customError = new Error(data.message || 'Unknown error')
      ;(customError as any).response = {
        status: data.status,
        data: data,
      }
      throw customError
    }

    // Nếu không có vấn đề gì => trả về response bình thường
    return response
  },

  // ---------------------------
  //          ERROR
  // ---------------------------
  async (error: AxiosError) => {
    const originalRequest = error.config
    const errorStatus = error.response?.status
    const errorData = error.response?.data

    console.log('Error Status:', errorStatus)
    console.log('Error Data:', errorData)

    // 4) Tại đây, nếu status=403 + "JWT expired", bạn gọi refresh
    if (errorStatus === 403 && originalRequest && !originalRequest._retry && (errorData as any)?.message?.includes('JWT expired')) {
      originalRequest._retry = true
      try {
        const { data } = await API_SERVICES.auth.refresh()
        const newAccessToken = data.access_token
        const newRefreshToken = data.refresh_token

        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    // Nếu không phải lỗi 403 token expired => reject thông thường
    return Promise.reject(error)
  }
)
export default apiClient
