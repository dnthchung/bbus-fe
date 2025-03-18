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
    GET_ONE: (id: string) => `/user/${id}`,
    LIST: '/user/list',
  },
  CHECKPOINTS: {
    GET_ALL: '/checkpoints/list',
  },
  STUDENTS: {
    LIST: '/student/list',
  },
} as const
