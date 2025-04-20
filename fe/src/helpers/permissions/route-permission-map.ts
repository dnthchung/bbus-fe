// src/permissions/routePermissionMap.ts

/**
 * Mỗi key là một đường dẫn (URL) gốc
 * hoặc path mà bạn muốn phân quyền.
 * Value là mảng các role được phép truy cập.
 */
export const routePermissionMap: Record<string, string[]> = {
  '/users': ['SYSADMIN', 'ADMIN'],

  //=====================================//
  '/students': ['ADMIN'],
  '/students/attendance': ['ADMIN'],
  '/transportation/schedules': ['ADMIN'],
  '/transportation/routes': ['ADMIN'],
  '/transportation/routes/list': ['ADMIN'],
  '/transportation/checkpoints': ['ADMIN'],
  '/buses/list': ['ADMIN'],
  '/buses/schedule': ['ADMIN'],
  '/requests': ['ADMIN'],
  '/requests/list': ['ADMIN'],
}
