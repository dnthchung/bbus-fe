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
    fetchUser: () => Promise<any>
  }
  users: {
    getAll: () => Promise<any>
    getOne: (id: string) => Promise<any>
    create: (userData: any) => Promise<any>
    update: (id: string, userData: any) => Promise<any>
    delete: (id: string) => Promise<any>
  }
}

export const API_SERVICES: ApiServices = {
  // 🔹 AUTH API
  auth: {
    login: (credentials: LoginCredentials) =>
      apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    logout: () => apiClient.get(API_ENDPOINTS.AUTH.LOGOUT),
    refresh: () => apiClient.get(API_ENDPOINTS.AUTH.REFRESH),
    fetchUser: () => apiClient.get(API_ENDPOINTS.AUTH.USER),
  },
  // 🔹 USER API
  users: {
    getAll: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
    getOne: (id: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ONE(id)),
    create: (userData: any) =>
      apiClient.post(API_ENDPOINTS.USERS.CREATE, userData),
    update: (id: string, userData: any) =>
      apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData),
    delete: (id: string) => apiClient.delete(API_ENDPOINTS.USERS.DELETE(id)),
  },
}

//2.2. Sử dụng generic types cho response
// Thay vì trả về Promise<any>, bạn có thể sử dụng generic types để định nghĩa kiểu dữ liệu cụ thể cho response của mỗi API.
// Định nghĩa kiểu dữ liệu cho API_SERVICES với generic types
// interface ApiServices {
//   auth: {
//     login: (credentials: LoginCredentials) => Promise<AuthResponse>;
//     logout: () => Promise<void>;
//     refresh: () => Promise<AuthResponse>;
//     fetchUser: () => Promise<UserProfile>;
//   };
//   users: {
//     getAll: () => Promise<User[]>;
//     getOne: (id: string) => Promise<User>;
//     create: (userData: CreateUserInput) => Promise<User>;
//     update: (id: string, userData: UpdateUserInput) => Promise<User>;
//     delete: (id: string) => Promise<void>;
//   };
// }
