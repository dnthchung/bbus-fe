// fe/src/api/api-services.ts
import type { LoginCredentials } from '@/types'
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
    send_otp_to_mail: (email: string) => Promise<any>
    verify_otp: (otp: string, email: string) => Promise<any>
    reset_password: (data: { sessionId: string; password: string; confirmPassword: string }) => Promise<any>
  }
  users: {
    update: (user: any) => Promise<any>
    update_avatar: (userId: string, avatarFile: File) => Promise<any>
    update_status: (userId: string, status: string) => Promise<any>
    getAll: () => Promise<any>
    getOne: (userId: string) => Promise<any>
    list: () => Promise<any>
    addOne: (user: any) => Promise<any>
    deleteOne: (userId: string) => Promise<any>
    getUserEntity: (userId: string) => Promise<any>
    importUserFile: (file: File, roleName: string) => Promise<any>
  }
  checkpoints: {
    get_all: () => Promise<any>
    get_all_with_student_count: () => Promise<any>
    add_one: (checkpoint: any) => Promise<any>
    count_students_of_one_checkpoint: (checkpointId: string) => Promise<any>
    get_a_checkpoint_by_checkpoint_id: (checkpointId: string) => Promise<any>
    get_all_by_page_size: (page: number, size: number) => Promise<any>
    get_all_checkpoint_no_route: () => Promise<any>
    update_status: (checkpointId: string, status: string) => Promise<any>
    update_status_auto_in_backend: (checkpointId: string) => Promise<any>
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
    updateAvatar: (studentId: string, avatarFile: File) => Promise<any>
    importStudentFile: (file: File) => Promise<any>
    get_list_student_by_checkpoint_id: (checkpointId: string) => Promise<any>
    get_history_by_student_id: (studentId: string) => Promise<any>
  }
  parents: {
    getParentList: () => Promise<any>
  }
  buses: {
    get_all: () => Promise<any>
    get_detail: (busId: string) => Promise<any>
    update_status: (busId: string, status: string) => Promise<any>
    update_max_capacity_for_all: (params: { maxCapacity: number; checkpointId?: string }) => Promise<any>
    get_list_bus_by_checkpoint_id: (checkpointId: string) => Promise<any>
    get_list_student_by_bus_id: (busId: string) => Promise<any>
    update_bus: (bus: any) => Promise<any>
  }
  drivers: {
    get_all: () => Promise<any>
    get_all_available: () => Promise<any>
  }
  assistants: {
    get_all: () => Promise<any>
    get_all_available: () => Promise<any>
  }
  bus_schedule: {
    get_dates_by_month: (month: string) => Promise<any>
    assign_batch: (dates: string[]) => Promise<any>
    delete_batch: (date: string) => Promise<any>
  }
  route: {
    delete_a_route: (routeId: string) => Promise<any>
    edit_route_by_route_id: (routeId: string, orderedCheckpointIds: string[], orderedCheckpointTimes: string[]) => Promise<any>
    get_a_route_by_bus_id: (busId: string) => Promise<any>
    get_all_route: () => Promise<any>
    get_a_route_by_route_id: (routeId: string) => Promise<any>
    get_bus_list_by_route_id: (routeId: string) => Promise<any>
    get_list_checkpoint_by_route_id: (routeId: string) => Promise<any>
    create_a_route: (route: any) => Promise<any>
  }
  requests: {
    get_all_request: () => Promise<any>
    get_all_request_type: () => Promise<any>
    get_a_request_details_by_request_id: (requestId: string) => Promise<any>
    reply_request: (request: any) => Promise<any>
    process_change_checkpoint: (requestId: string) => Promise<any>
  }
  camera: {
    upload_student_to_camera: () => Promise<any>
  }
  event: {
    create_event: (data: { name: string; start: string; end: string }) => Promise<any>
    update_event: (data: { name: string; start: string; end: string }) => Promise<any>
    get_event_by_name: (name: string) => Promise<any>
    lay_thoi_gian_mo_don: () => Promise<any>
    lay_tg_nam_hoc_hien_tai: () => Promise<any>
    doi_thoi_gian_nam_hoc_hien_tai: (data: { name: string; startDate: string; endDate: string }) => Promise<any>
    doi_thoi_gian_mo_don: (data: { name: string; start: string; end: string }) => Promise<any>
  }
  dashboard: {
    dem_so_hoc_sinh: () => Promise<any>
    dem_so_yeu_cau: () => Promise<any>
    thong_so_account: () => Promise<any>
    tong_tuyen_duong: () => Promise<any>
  }
}

// Add the implementation in the students section of API_SERVICES
export const API_SERVICES: ApiServices = {
  dashboard: {
    dem_so_hoc_sinh: () => apiClient.get(API_ENDPOINTS.DASHBOARD.DEM_SO_HOC_SINH),
    dem_so_yeu_cau: () => apiClient.get(API_ENDPOINTS.DASHBOARD.DEM_SO_YEU_CAU),
    thong_so_account: () => apiClient.get(API_ENDPOINTS.DASHBOARD.THONG_SO_ACCOUNT),
    tong_tuyen_duong: () => apiClient.get(API_ENDPOINTS.DASHBOARD.TONG_TUYEN_DUONG),
  },
  camera: {
    upload_student_to_camera: () => apiClient.get(API_ENDPOINTS.CAMERA.UPLOAD_STUDENT_TO_CAMERA),
  },
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
    send_otp_to_mail: (email: string) => apiClient.post(`${API_ENDPOINTS.AUTH.SEND_OTP_TO_MAIL}?email=${email}`),
    verify_otp: (otp: string, email: string) => apiClient.post(`${API_ENDPOINTS.AUTH.VERIFY_OTP}?email=${email}&otp=${otp}`),
    reset_password: ({ sessionId, password, confirmPassword }) =>
      apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        sessionId,
        password,
        confirmPassword,
      }),
  },

  // -------------------------
  // 2) USERS
  // -------------------------
  users: {
    update: (user: any) => apiClient.put(API_ENDPOINTS.USERS.UPDATE(), user),
    getAll: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
    getOne: (userId: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ONE(userId)),
    list: () => apiClient.get(API_ENDPOINTS.USERS.LIST),
    addOne: (user: any) => apiClient.post(API_ENDPOINTS.USERS.ADD_ONE, user),
    deleteOne: (userId: string) => apiClient.delete(API_ENDPOINTS.USERS.DELETE_ONE(userId)),
    getUserEntity: (userId: string) => apiClient.get(API_ENDPOINTS.USERS.GET_ENTITY_BY_USER_ID(userId)),
    importUserFile: (file: File, roleName: string) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('roleName', roleName)

      return apiClient.post(API_ENDPOINTS.USERS.IMPORT_USER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    update_avatar: (userId: string, avatarFile: File) => {
      const formData = new FormData()
      formData.append('id', userId)
      formData.append('avatar', avatarFile)

      return apiClient.patch(API_ENDPOINTS.USERS.UPDATE_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    update_status: (userId: string, status: string) =>
      apiClient.patch(API_ENDPOINTS.USERS.UPDATE_STATUS, {
        id: userId,
        status: status,
      }),
  },
  // -------------------------
  // 3) CHECKPOINTS
  // -------------------------
  checkpoints: {
    get_all: () => apiClient.get(API_ENDPOINTS.CHECKPOINTS.GET_ALL),
    get_all_with_student_count: () => apiClient.get(API_ENDPOINTS.CHECKPOINTS.GET_ALL_WITH_STUDENT_COUNT),
    add_one: (checkpoint: any) => apiClient.post(API_ENDPOINTS.CHECKPOINTS.ADD_ONE, checkpoint),
    count_students_of_one_checkpoint: (checkpointId: string) => apiClient.get(`${API_ENDPOINTS.CHECKPOINTS.COUNT_STUDENTS_OF_ONE_CHECKPOINT}?checkpointId=${checkpointId}`),
    get_a_checkpoint_by_checkpoint_id: (checkpointId: string) => apiClient.get(`${API_ENDPOINTS.CHECKPOINTS.GET_A_CHECKPOINT_BY_CHECKPOINT_ID}/${checkpointId}`),
    get_all_by_page_size: (page: number, size: number) => {
      return apiClient.get(`${API_ENDPOINTS.CHECKPOINTS.GET_ALL_BY_PAGE_SIZE}?page=${page}&size=${size}`)
    },
    get_all_checkpoint_no_route: () => apiClient.get(API_ENDPOINTS.CHECKPOINTS.GET_ALL_NO_ROUTE),
    update_status: (checkpointId: string, status: string) => apiClient.patch(API_ENDPOINTS.CHECKPOINTS.UPDATE_STATUS, { id: checkpointId, status: status }),
    update_status_auto_in_backend: (checkpointId: string) => apiClient.patch(`${API_ENDPOINTS.CHECKPOINTS.UPDATE_STATUS_AUTO_IN_BACKEND}/${checkpointId}/toggle-status`),
  },
  //-------------------------
  // 4) STUDENTS
  //-------------------------
  students: {
    get_history_by_student_id: (studentId: string) => apiClient.get(`${API_ENDPOINTS.STUDENTS.GET_HISTORY_BY_STUDENT_ID}/${studentId}`),
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
    importStudentFile: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post(API_ENDPOINTS.STUDENTS.IMPORT_STUDENT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    get_list_student_by_checkpoint_id: (checkpointId: string) => apiClient.get(`${API_ENDPOINTS.STUDENTS.GET_LIST_STUDENT_BY_CHECKPOINT_ID}?checkpointId=${checkpointId}`),
  },
  //-------------------------
  // 5) PARENTS
  //-------------------------
  parents: {
    getParentList: () => apiClient.get(API_ENDPOINTS.PARENTS.GET_PARENT_LIST),
  },
  //--------------------------
  // 7) Bus
  //--------------------------
  // In the buses section of API_SERVICES
  buses: {
    get_all: () => apiClient.get(API_ENDPOINTS.BUSES.GET_ALL),
    get_detail: (busId: string) => apiClient.get(API_ENDPOINTS.BUSES.GET_DETAIL(busId)),
    update_status: (busId: string, status: string) => apiClient.patch(API_ENDPOINTS.BUSES.UPDATE_STATUS, { id: busId, status: status }),
    update_max_capacity_for_all: (params: { maxCapacity: number }) => {
      const url = new URL(API_ENDPOINTS.BUSES.UPDATE_MAX_CAPACITY_FOR_ALL, import.meta.env.VITE_API_URL_BBUS)
      url.searchParams.append('maxCapacity', params.maxCapacity.toString())
      return apiClient.post(url.pathname + url.search)
    },
    get_list_bus_by_checkpoint_id: (checkpointId: string) => apiClient.get(`${API_ENDPOINTS.BUSES.GET_LIST_BUS_BY_CHECKPOINT_ID}?checkpointId=${checkpointId}`),
    get_list_student_by_bus_id: (busId: string) => apiClient.get(`${API_ENDPOINTS.STUDENTS.GET_LIST_STUDENT_BY_BUS_ID}?busId=${busId}`),
    update_bus: (bus: any) => apiClient.put(API_ENDPOINTS.BUSES.UPDATE_BUS, bus),
  },
  //--------------------------
  // 8) Driver
  //--------------------------
  drivers: {
    get_all: () => apiClient.get(API_ENDPOINTS.DRIVER.GET_ALL),
    get_all_available: () => apiClient.get(API_ENDPOINTS.DRIVER.GET_ALL_AVAILABLE),
  },
  //--------------------------
  // 9) Assistant
  //--------------------------
  assistants: {
    get_all: () => apiClient.get(API_ENDPOINTS.ASSISTANT.GET_ALL),
    get_all_available: () => apiClient.get(API_ENDPOINTS.ASSISTANT.GET_ALL_AVAILABLE),
  },
  //--------------------------
  // 10) Schedule
  //--------------------------
  bus_schedule: {
    get_dates_by_month: (month: string) => apiClient.get(`${API_ENDPOINTS.SCHEDULE.GET_DATES_BY_MONTH}?month=${month}&size=1000`),
    assign_batch: (dates: string[]) => apiClient.post(API_ENDPOINTS.SCHEDULE.ASSIGN_BATCH, { dates }),
    delete_batch: (date: string) => apiClient.delete(`${API_ENDPOINTS.SCHEDULE.DELETE_BATCH}?date=${date}`),
  },
  //--------------------------
  // 11) route
  //--------------------------
  route: {
    delete_a_route: (routeId: string) => apiClient.delete(`${API_ENDPOINTS.ROUTE.DELETE_A_ROUTE}/${routeId}`),
    edit_route_by_route_id: (routeId: string, orderedCheckpointIds: string[], orderedCheckpointTimes: string[]) => apiClient.patch(API_ENDPOINTS.ROUTE.EDIT_ROUTE_BY_ROUTE_ID, { routeId, orderedCheckpointIds, orderedCheckpointTimes }),
    get_a_route_by_bus_id: (busId: string) => apiClient.get(`${API_ENDPOINTS.ROUTE.GET_A_ROUTE_BY_BUS_ID}?busId=${busId}`),
    get_all_route: () => apiClient.get(API_ENDPOINTS.ROUTE.GET_ALL_ROUTE),
    get_a_route_by_route_id: (routeId: string) => apiClient.get(`${API_ENDPOINTS.ROUTE.GET_A_ROUTE_BY_ROUTE_ID}/${routeId}`),
    get_bus_list_by_route_id: (routeId: string) => apiClient.get(`${API_ENDPOINTS.ROUTE.GET_BUS_LIST_BY_ROUTE_ID}?routeId=${routeId}`),
    get_list_checkpoint_by_route_id: (routeId: string) => apiClient.get(`${API_ENDPOINTS.ROUTE.GET_LIST_CHECKPOINT_BY_ROUTE_ID}?routeId=${routeId}`),
    create_a_route: (route: any) => apiClient.post(API_ENDPOINTS.ROUTE.CREATE_A_ROUTE, route),
  },
  requests: {
    get_all_request: () => apiClient.get(API_ENDPOINTS.REQUESTS.GET_ALL_REQUEST),
    get_all_request_type: () => apiClient.get(API_ENDPOINTS.REQUESTS.GET_ALL_REQUEST_TYPE),
    get_a_request_details_by_request_id: (requestId: string) => apiClient.get(`${API_ENDPOINTS.REQUESTS.GET_A_REQUEST_DETAILS_BY_REQUEST_ID}/${requestId}`),
    reply_request: (request: any) => apiClient.patch(API_ENDPOINTS.REQUESTS.REPLY_REQUEST, request),
    process_change_checkpoint: (requestId: string) => apiClient.post(`${API_ENDPOINTS.REQUESTS.PROCESS_CHANGE_CHECKPOINT}/${requestId}`),
  },
  event: {
    create_event: (data: { name: string; start: string; end: string }) => apiClient.post(API_ENDPOINTS.EVENT.CREATE_EVENT, data),
    update_event: (data: { name: string; start: string; end: string }) => apiClient.put(API_ENDPOINTS.EVENT.UPDATE_EVENT, data),
    lay_thoi_gian_mo_don: () => apiClient.get(API_ENDPOINTS.EVENT.LAY_THOI_GIAN_MO_DON),
    lay_tg_nam_hoc_hien_tai: () => apiClient.get(API_ENDPOINTS.EVENT.LAY_TG_NAM_HOC_HIEN_TAI),
    doi_thoi_gian_nam_hoc_hien_tai: (data: { name: string; startDate: string; endDate: string }) => apiClient.put(API_ENDPOINTS.EVENT.DOI_THOI_GIAN_NAM_HOC_HIEN_TAI, data),
    doi_thoi_gian_mo_don: (data: { name: string; start: string; end: string }) => apiClient.put(API_ENDPOINTS.EVENT.DOI_THOI_GIAN_MO_DON, data),
    get_event_by_name: (name: string) => apiClient.get(`${API_ENDPOINTS.EVENT.LAY_TG_NAM_HOC_HIEN_TAI}?name=${name}`),
  },
}
