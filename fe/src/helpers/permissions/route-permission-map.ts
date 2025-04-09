// src/permissions/routePermissionMap.ts

/**
 * Mỗi key là một đường dẫn (URL) gốc 
 * hoặc path mà bạn muốn phân quyền.
 * Value là mảng các role được phép truy cập.
 */
export const routePermissionMap: Record<string, string[]> = {
    '/users': ['SYSADMIN'],
    
    //=====================================//
    '/students': ['ADMIN'],
    '/students/attendance': ['ADMIN'],
    '/transportation/schedules': ['ADMIN'],
    '/transportation/routes': ['ADMIN'],
    '/transportation/checkpoints': ['ADMIN'],
    '/buses/list': ['ADMIN'],
    
  }
  