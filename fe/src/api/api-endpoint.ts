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
  TRANSPORTATION: {
    CHECKPOINTS: {
      GET_ALL: '/checkpoints/list',
    },
  },
  BUSES: {
    GET_ALL: '/bus/list',
    GET_DETAIL: (busId: string) => `/bus/${busId}`,
    UPDATE_STATUS: '/bus/status',
    UPDATE_MAX_CAPACITY_FOR_ALL: '/bus/upd-max-capacity-for-all-bus',
  },
  DRIVER: {
    GET_ALL: '/driver/list',
  },
  ASSISTANT: {
    GET_ALL: '/assistant/list',
  },
} as const
