import {
  IconBug,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconPalette,
  IconSettings,
  IconUser,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconReport,
  IconBusStop,
  IconBus,
  IconFlag,
  IconNotification,
} from '@tabler/icons-react'

import { Bus, CalendarCheck, MapPinPlus, Route } from 'lucide-react'
import {
  type SidebarData,
  type NavGroup,
  type NavItem,
  type NavCollapsible,
  type NavLink,
} from '@/components/layout/sidebar/sidebar-type'

// ------------------------------
// ❄️ Default sidebar definition
// ------------------------------
export const sidebarData: SidebarData = {
  user: {
    name: 'chung',
    email: 'chung@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Trường Liên cấp THCS & Tiểu học Tư thục Ngôi Sao Hà Nội',
      logo: Bus,
      plan: 'BBus System ',
    },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Quản lý',
      items: [
        {
          title: 'Quản lý TK người dùng',
          url: '/users',
          icon: IconLockAccess,
        },
        {
          title: 'Quản lý học sinh',
          icon: IconUser,
          items: [
            {
              title: 'DS học sinh',
              url: '/students',
              icon: IconUsers,
            },
            {
              title: 'Lịch sử điểm danh',
              url: '/students/attendance',
              icon: IconUserOff,
            },
          ],
        },
        {
          title: 'Quản lý tuyến đường',
          icon: Route,
          items: [
            {
              title: 'DS tuyến đường',
              url: '/transportation/routes',
              icon: MapPinPlus,
            },
            {
              title: 'Lịch trình',
              url: '/transportation/schedules',
              icon: CalendarCheck,
            },
            {
              title: 'DS các điểm dừng',
              url: '/transportation/checkpoints',
              icon: IconBusStop,
            },
          ],
        },
        {
          title: 'Quản lý xe bus',
          icon: IconBus,
          items: [
            {
              title: 'DS xe bus',
              url: '/buses/list',
              icon: IconBus,
            },
          ],
        },
        {
          title: 'Quản lý báo cáo',
          icon: IconReport,
          items: [
            {
              title: 'DS báo cáo',
              url: '/401',
              icon: IconFlag,
            },
            {
              title: 'Báo cáo điểm danh',
              url: '/403',
              icon: IconUserOff,
            },
          ],
        },
      ],
    },
    {
      title: 'Khác',
      items: [
        {
          title: 'Cài đặt',
          icon: IconSettings,
          items: [
            {
              title: 'Hồ sơ',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Giao diện',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Thông báo',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Trợ giúp',
          url: '/help-center',
          icon: IconHelp,
        },
        {
          title: 'Báo cáo',
          url: '/help-center',
          icon: IconBug,
        },
      ],
    },
  ],
}

// ------------------------------
// 🔍 Type guard to avoid nulls
// ------------------------------
function isNotNull<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined
}

// ------------------------------
// ✅ Role-based filtering
// ------------------------------
export function filterSidebarData(
  permissions: ReturnType<typeof import('@/hooks/use-role-permissions').useRolePermissions>
): SidebarData {
  const {
    canAccessUserManagement,
    canAccessStudents,
    canAccessTransportation,
    canAccessReports,
    canAccessBuses,
  } = permissions

  // 👇 Role-to-title mapping
  const checkPermission = (title: string): boolean => {
    if (title === 'Quản lý TK người dùng') return canAccessUserManagement
    if (title === 'Quản lý học sinh') return canAccessStudents
    if (title === 'Quản lý tuyến đường') return canAccessTransportation
    if (title === 'Quản lý xe bus') return canAccessBuses
    if (title === 'Quản lý báo cáo') return canAccessReports
    return true
  }

  const filteredNavGroups: NavGroup[] = sidebarData.navGroups
    .map((group): NavGroup | null => {
      const filteredItems: NavItem[] = group.items
        .map((item): NavItem | null => {
          // Nếu là collapsible
          if ('items' in item && Array.isArray(item.items)) {
            const filteredSubItems = item.items.filter((subItem) =>
              checkPermission(subItem.title)
            )

            if (filteredSubItems.length === 0) return null

            // Trả về NavCollapsible (phải loại bỏ `url`)
            const collapsible: NavCollapsible = {
              title: item.title,
              icon: item.icon,
              badge: item.badge,
              items: filteredSubItems,
            }

            return collapsible
          }

          // Nếu là NavLink
          return checkPermission(item.title) ? item as NavLink : null
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
