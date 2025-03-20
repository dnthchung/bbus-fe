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
    getOne: (userId: string) => Promise<any>
    list: () => Promise<any>
    addOne: (user: any) => Promise<any>
  }
  checkpoints: {
    getAll: () => Promise<any>
  }
  students: {
    list: () => Promise<any>
    addOne: (student: any) => Promise<any>
    updateOne: (studentId: string, student: any) => Promise<any>
    getOne: (studentId: string) => Promise<any>
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
    getOne: (userId: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ONE(userId)),
    list: () => apiClient.get(API_ENDPOINTS.USERS.LIST),
    addOne: (user: any) => apiClient.post(API_ENDPOINTS.USERS.ADD_ONE, user),
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
    addOne: (student: any) => apiClient.post(API_ENDPOINTS.STUDENTS.ADD_ONE, student),
    updateOne: (studentId: string, student: any) => apiClient.put(API_ENDPOINTS.STUDENTS.UPDATE_ONE(studentId), student),
    getOne: (studentId: string) => apiClient.get(API_ENDPOINTS.STUDENTS.GET_ONE(studentId)),
  },
}
