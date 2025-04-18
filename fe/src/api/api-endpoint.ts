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
    GET_ALL_NO_ROUTE: '/checkpoint/no-route',
    ADD_ONE: '/checkpoint/add',
    COUNT_STUDENTS_OF_ONE_CHECKPOINT: '/checkpoint/count-students',
    GET_A_CHECKPOINT_BY_CHECKPOINT_ID: '/checkpoint',
    GET_ALL_BY_PAGE_SIZE: '/checkpoint/list',
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
    GET_LIST_STUDENT_BY_BUS_ID: '/student/by-bus',
    GET_HISTORY_BY_STUDENT_ID: '/attendance',
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
    UPDATE_BUS: '/bus/upd',
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
    GET_ALL_ROUTE: '/route/list',
    GET_A_ROUTE_BY_ROUTE_ID: '/route',
    GET_BUS_LIST_BY_ROUTE_ID: '/bus/by_route',
    GET_LIST_CHECKPOINT_BY_ROUTE_ID: '/checkpoint/by-route',
    CREATE_A_ROUTE: '/route/add',
  },
  REQUESTS: {
    GET_ALL_REQUEST: '/request/list',
    GET_ALL_REQUEST_TYPE: '/request-type/list',
    GET_A_REQUEST_DETAILS_BY_REQUEST_ID: '/request',
    REPLY_REQUEST: '/request/reply',
    PROCESS_CHANGE_CHECKPOINT: '/request/process-change-checkpoint',
  },
} as const
