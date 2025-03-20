//path : fe/src/api/api-endpoint.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    USER: (userId: string) => `/user/${userId}`,
  },
  USERS: {
    GET_ALL: '/user',
    GET_ONE: (userId: string) => `/user/${userId}`,
    LIST: '/user/list',
    ADD_ONE: '/user/add',
  },
  CHECKPOINTS: {
    GET_ALL: '/checkpoints/list',
  },
  STUDENTS: {
    LIST: '/student/list',
    ADD_ONE: '/student/add',
    UPDATE_ONE: (studentId: string) => `/student/${studentId}`,
    GET_ONE: (studentId: string) => `/student/${studentId}`,
  },
} as const
