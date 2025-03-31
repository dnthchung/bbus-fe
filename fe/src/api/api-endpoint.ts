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
    DELETE_ONE: (userId: string) => `/user/del/${userId}`,
    GET_ENTITY_BY_USER_ID: (userId: string) => `/user/entity/${userId}`,
  },
  CHECKPOINTS: {
    GET_ALL: '/checkpoints/list',
  },
  STUDENTS: {
    LIST: '/student/list',
    ADD_ONE: '/student/add',
    UPDATE_ONE: (studentId: string) => `/student/${studentId}`,
    GET_ONE: (studentId: string) => `/student/${studentId}`,
    DELETE_ONE: (studentId: string) => `/student/del/${studentId}`,
    UPDATE: () => `/student/upd`,
  },
  PARENTS: {
    GET_PARENT_LIST: '/parent/list',
  },
} as const
