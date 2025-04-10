// src/api/api-client.ts
import axios, { AxiosError } from 'axios'
import { API_SERVICES } from './api-services'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BBUS,
  withCredentials: true,
  headers: {
    'Content-Type': undefined
  },
})

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

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data

    if (data?.status === 403 && data?.message?.includes('JWT expired')) {
      const customError = new Error('JWT expired')
      ;(customError as any).response = { status: 403, data }
      throw customError
    }

    if (data?.status >= 400) {
      const customError = new Error(data.message || 'Unknown error')
      ;(customError as any).response = { status: data.status, data }
      throw customError
    }

    return response
  },

  async (error: AxiosError) => {
    const originalRequest = error.config
    const errorStatus = error.response?.status
    const errorData = error.response?.data

    if (
      errorStatus === 403 &&
      originalRequest &&
      !originalRequest._retry &&
      (errorData as any)?.message?.includes('JWT expired')
    ) {
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
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
