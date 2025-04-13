//path : fe/src/api/api-endpoint.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    USER: (userId: string) => `/user/${userId}`,
  },
  USERS: {
    GET_ALL: '/user?size=10000',
    GET_ONE: (userId: string) => `/user/${userId}`,
    LIST: '/user/list',
    ADD_ONE: '/user/add',
    DELETE_ONE: (userId: string) => `/user/del/${userId}`,
    GET_ENTITY_BY_USER_ID: (userId: string) => `/user/entity/${userId}`,
    IMPORT_USER: '/user/import',
  },
  CHECKPOINTS: {
    GET_ALL: '/checkpoint/list',
    ADD_ONE: '/checkpoint/add',
    COUNT_STUDENTS_OF_ONE_CHECKPOINT: '/checkpoint/count-students',
    GET_A_CHECKPOINT_BY_CHECKPOINT_ID: '/checkpoint',
  },
  STUDENTS: {
    LIST: '/student/list?size=10000',
    ADD_ONE: '/student/add',
    UPDATE_ONE: (studentId: string) => `/student/${studentId}`,
    GET_ONE: (studentId: string) => `/student/${studentId}`,
    DELETE_ONE: (studentId: string) => `/student/del/${studentId}`,
    UPDATE: () => `/student/upd`,
    UPDATE_STATUS: '/student/change-status',
    UPDATE_AVATAR: '/student/update-avatar', // New endpoint for avatar update
    GET_STUDENT_LIST: '/student/list',
    GET_STUDENT_LIST_BY_ENTITY_ID: (entityId: string) => `/student/list/${entityId}`,
    IMPORT_STUDENT: '/student/import',
    GET_LIST_STUDENT_BY_CHECKPOINT_ID: '/checkpoint/students',
  },
  PARENTS: {
    GET_PARENT_LIST: '/parent/list?size=10000',
  },
  TRANSPORTATION: {
    CHECKPOINTS: {
      GET_ALL: '/checkpoint/list',
    },
  },
  BUSES: {
    GET_ALL: '/bus/list?size=10000',
    GET_DETAIL: (busId: string) => `/bus/${busId}`,
    UPDATE_STATUS: '/bus/status',
    UPDATE_MAX_CAPACITY_FOR_ALL: '/bus/upd-max-capacity-for-all-bus',
    GET_LIST_BUS_BY_CHECKPOINT_ID: '/bus/by-checkpoint',
  },
  DRIVER: {
    GET_ALL: '/driver/list',
  },
  ASSISTANT: {
    GET_ALL: '/assistant/list',
  },
  SCHEDULE: {
    GET_DATES_BY_MONTH: '/bus-schedule/dates',
    ASSIGN_BATCH: '/bus-schedule/assign-batch',
    DELETE_BATCH: '/bus-schedule',
  },
  ROUTE: {
    GET_A_ROUTE_BY_BUS_ID: '/route/by-bus',
  },
} as const
