// fe/src/api/api-services.ts
import { LoginCredentials } from '@/types'
import apiClient from '@/api/api-client'
import { API_ENDPOINTS } from './api-endpoint'

// Gợi ý: Định nghĩa type chung cho cấu trúc trả về,
// tùy logic BE (có thể tuỳ biến, đây chỉ là ví dụ).
// Update the ApiServices interface
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
    deleteOne: (userId: string) => Promise<any>
    getUserEntity: (userId: string) => Promise<any>
  }
  checkpoints: {
    getAll: () => Promise<any>
  }
  students: {
    list: () => Promise<any>
    addOne: (student: any) => Promise<any>
    updateOne: (studentId: string, student: any) => Promise<any>
    getOne: (studentId: string) => Promise<any>
    deleteOne: (studentId: string) => Promise<any>
    update: (student: any) => Promise<any>
    updateParent: (student: any) => Promise<any>
    updateStatus: (studentId: string, status: string) => Promise<any>
    updateAvatar: (studentId: string, avatarFile: File) => Promise<any> // New method
  }
  parents: {
    getParentList: () => Promise<any>
  }
  transportation: {
    checkpoints: {
      list: () => Promise<any>
    }
  }
  buses: {
    get_all: () => Promise<any>
    get_detail: (busId: string) => Promise<any>
    update_status: (busId: string, status: string) => Promise<any>
    update_max_capacity_for_all: (params: { maxCapacity: number; checkpointId?: string }) => Promise<any>
  }
  drivers: {
    get_all: () => Promise<any>
  }
  assistants: {
    get_all: () => Promise<any>
  }
  bus_schedule: {
    get_dates_by_month: (month: string) => Promise<any>
    assign_batch: (dates: string[]) => Promise<any>
    delete_batch: (date: string) => Promise<any>
  }
}

// Add the implementation in the students section of API_SERVICES
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
    deleteOne: (userId: string) => apiClient.delete(API_ENDPOINTS.USERS.DELETE_ONE(userId)),
    getUserEntity: (userId: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ENTITY_BY_USER_ID(userId)),
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
    deleteOne: (studentId: string) => apiClient.delete(API_ENDPOINTS.STUDENTS.DELETE_ONE(studentId)),
    update: (student: any) => apiClient.put(API_ENDPOINTS.STUDENTS.UPDATE(), student),
    updateParent: (student: any) => apiClient.put(API_ENDPOINTS.STUDENTS.UPDATE(), student),
    updateStatus: (studentId: string, status: string) =>
      apiClient.patch(API_ENDPOINTS.STUDENTS.UPDATE_STATUS, {
        id: studentId,
        status: status,
      }),
    updateAvatar: (studentId: string, avatarFile: File) => {
      const formData = new FormData()
      formData.append('id', studentId)
      formData.append('avatar', avatarFile)

      return apiClient.patch(API_ENDPOINTS.STUDENTS.UPDATE_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  },
  //-------------------------
  // 5) PARENTS
  //-------------------------
  parents: {
    getParentList: () => apiClient.get(API_ENDPOINTS.PARENTS.GET_PARENT_LIST),
  },
  //-------------------------
  // 6) TRANSPORTATION
  //-------------------------
  transportation: {
    checkpoints: {
      list: () => apiClient.get(API_ENDPOINTS.CHECKPOINTS.GET_ALL),
    },
  },
  //--------------------------
  // 7) Bus
  //--------------------------
  // In the buses section of API_SERVICES
  buses: {
    get_all: () => apiClient.get(API_ENDPOINTS.BUSES.GET_ALL),
    get_detail: (busId: string) => apiClient.get(API_ENDPOINTS.BUSES.GET_DETAIL(busId)),
    update_status: (busId: string, status: string) =>
      apiClient.patch(API_ENDPOINTS.BUSES.UPDATE_STATUS, {
        id: busId,
        status: status,
      }),
    update_max_capacity_for_all: (params: { maxCapacity: number }) => {
      const url = new URL(API_ENDPOINTS.BUSES.UPDATE_MAX_CAPACITY_FOR_ALL, import.meta.env.VITE_API_URL_BBUS)
      url.searchParams.append('maxCapacity', params.maxCapacity.toString())
      return apiClient.post(url.pathname + url.search)
    },
  },
  //--------------------------
  // 8) Driver
  //--------------------------
  drivers: {
    get_all: () => apiClient.get(API_ENDPOINTS.DRIVER.GET_ALL),
  },
  //--------------------------
  // 9) Assistant
  //--------------------------
  assistants: {
    get_all: () => apiClient.get(API_ENDPOINTS.ASSISTANT.GET_ALL),
  },
  //--------------------------
  // 10) Schedule
  //--------------------------

  bus_schedule: {
    get_dates_by_month: (month: string) => apiClient.get(`${API_ENDPOINTS.SCHEDULE.GET_DATES_BY_MONTH}?month=${month}&size=1000`),
    assign_batch: (dates: string[]) => apiClient.post(API_ENDPOINTS.SCHEDULE.ASSIGN_BATCH, { dates }),
    delete_batch: (date: string) => apiClient.delete(`${API_ENDPOINTS.SCHEDULE.DELETE_BATCH}?date=${date}`),
  },
}
