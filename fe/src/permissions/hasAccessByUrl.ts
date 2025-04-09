// src/permissions/hasAccessByUrl.ts
import { routePermissionMap } from '@/permissions/routePermissionMap'

/**
 * Kiểm tra 1 URL xem role hiện tại có được phép truy cập không
 * @param url: string | undefined 
 * @param userRole: string
 */
export function hasAccessByUrl(url: string | undefined, userRole: string): boolean {
  // Nếu item không có url (là group, hoặc collapsible gốc), ta cho hiển thị luôn
  if (!url) return true

  // Lấy danh sách role được phép từ routePermissionMap
  const allowedRoles = routePermissionMap[url]

  // Nếu route này không có trong map => coi như "mọi role" đều được
  if (!allowedRoles) {
    return true
  }

  // Kiểm tra userRole có nằm trong danh sách allowedRoles hay không
  // Nhớ rằng `user.role` có thể là 'ADMIN' hay 'SYSADMIN', v.v...
  // Nếu userRole = 'SYSADMIN', allowedRoles = ['ADMIN','SYSADMIN'] => true
  //   return allowedRoles.some((allowedRole) => userRole.includes(allowedRole))
  // SỬA: thay vì userRole.includes(allowedRole), ta dùng so sánh ===
return allowedRoles.some((allowedRole) => userRole === allowedRole)
}
