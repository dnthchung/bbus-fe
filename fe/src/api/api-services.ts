// src/hooks/api-services.ts
import { LoginCredentials } from '@/types'
import apiClient from '@/api/api-client'
import { API_ENDPOINTS } from '@/api/api-endpoint'

// Định nghĩa kiểu dữ liệu cho API_SERVICES
interface ApiServices {
  auth: {
    login: (credentials: LoginCredentials) => Promise<any>
    logout: () => Promise<any>
    refresh: () => Promise<any>
    fetchUser: (userId: string) => Promise<any>
  }
  users: {
    getAll: () => Promise<any>
    getOne: (id: string) => Promise<any>
  }
}

export const API_SERVICES: ApiServices = {
  // 🔹 AUTH API
  auth: {
    login: (credentials: LoginCredentials) => {
      const payload = {
        ...credentials,
        platform: 'WEB', // Fixed value
        deviceToken: 'x-token', // Fixed value
        versionApp: 'v1.2.9', // Fixed value
      }
      return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    },
    logout: () => apiClient.get(API_ENDPOINTS.AUTH.LOGOUT),
    refresh: () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return Promise.reject(new Error('No refresh token available'))
      }
      // Gửi refreshToken trong body của POST request
      return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    },
    fetchUser: (userId: string) => apiClient.get(API_ENDPOINTS.AUTH.USER(userId)),
  },
  // 🔹 USER API
  users: {
    getAll: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
    getOne: (id: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ONE(id)),
  },
}
