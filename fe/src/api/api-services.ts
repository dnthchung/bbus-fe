// fe/src/api/api-services.ts
import { LoginCredentials } from '@/types'
import apiClient from '@/api/api-client'
import { API_ENDPOINTS } from './api-endpoint'

// Gợi ý: Định nghĩa type chung cho cấu trúc trả về,
// tùy logic BE (có thể tuỳ biến, đây chỉ là ví dụ).
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
    list: () => Promise<any>
  }
  checkpoints: {
    getAll: () => Promise<any>
  }
  students: {
    list: () => Promise<any>
  }
}

export const API_SERVICES: ApiServices = {
  // -------------------------
  // 1) AUTH
  // -------------------------
  auth: {
    login: (credentials: LoginCredentials) => {
      const payload = {
        ...credentials,
        platform: 'WEB',
        deviceToken: 'x-token',
        versionApp: 'v1.2.9',
      }
      return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    },
    logout: () => apiClient.get(API_ENDPOINTS.AUTH.LOGOUT),
    refresh: () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return Promise.reject(new Error('No refresh token available'))
      }
      return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    },
    fetchUser: (userId: string) => apiClient.get(API_ENDPOINTS.AUTH.USER(userId)),
  },

  // -------------------------
  // 2) USERS
  // -------------------------
  users: {
    getAll: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
    getOne: (id: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ONE(id)),
    list: () => apiClient.get(API_ENDPOINTS.USERS.LIST),
  },
  // -------------------------
  // 3) CHECKPOINTS
  // -------------------------
  checkpoints: {
    getAll: () => apiClient.get(API_ENDPOINTS.CHECKPOINTS.GET_ALL),
  },
  //-------------------------
  // 4) STUDENTS
  //-------------------------
  students: {
    list: () => apiClient.get(API_ENDPOINTS.STUDENTS.LIST),
  },
}
