// src/components/layout/sidebar/filterSidebarData.ts
import { sidebarData } from './sidebar-data'
import { NavGroup, NavItem, NavCollapsible, NavLink } from '@/components/layout/sidebar/sidebar-type'
import { hasAccessByUrl } from '@/helpers/permissions/has-access-by-url'
import { useAuthQuery } from '@/hooks/use-auth'

/**
 * Type guard tránh null
 */
function isNotNull<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined
}

/**
 * Lọc navGroups trong sidebar dựa theo role của user,
 * bằng cách kiểm tra map routePermissionMap.
 */
export function sideBarFilterData(): typeof sidebarData {
  // Lấy user từ hook (lấy ra user.role)
  const { user } = useAuthQuery()
  // Nếu user chưa đăng nhập => tạm coi role = '' hoặc undefined
  const userRole = user?.role || ''

  const filteredNavGroups: NavGroup[] = sidebarData.navGroups
    .map((group) => {
      // Lọc các item con
      const filteredItems: NavItem[] = group.items
        .map((item) => {
          // Nếu là collapsible => lọc subItems
          if ('items' in item && Array.isArray(item.items)) {
            const filteredSubItems = item.items.filter((subItem) => {
              return hasAccessByUrl(subItem.url, userRole)
            })

            if (filteredSubItems.length === 0) return null

            // Trả về một NavCollapsible
            const collapsible: NavCollapsible = {
                title: item.title,
                badge: item.badge,
                icon: item.icon,
                items: filteredSubItems, // Mảng con đã lọc xong
              }
            return collapsible
          }

          // Nếu item thường => kiểm tra url
          if (!hasAccessByUrl(item.url, userRole)) {
            return null
          }

          return item as NavLink
        })
        .filter(isNotNull)

      if (filteredItems.length === 0) return null

      return {
        ...group,
        items: filteredItems,
      }
    })
    .filter(isNotNull)

  return {
    ...sidebarData,
    navGroups: filteredNavGroups,
  }
}
