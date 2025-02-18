//path : fe/src/api/api-endpoint.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    USER: '/user',
  },
  USERS: {
    GET_ALL: '/users',
    GET_ONE: (id: string) => `/users/${id}`,
    CREATE: '/users/create',
    UPDATE: (id: string) => `/users/update/${id}`,
    DELETE: (id: string) => `/users/delete/${id}`,
  },
  TASKS: {
    GET_ALL: '/tasks',
    GET_ONE: (id: string) => `/tasks/${id}`,
    CREATE: '/tasks/create',
    UPDATE: (id: string) => `/tasks/update/${id}`,
    DELETE: (id: string) => `/tasks/delete/${id}`,
  },
} as const
