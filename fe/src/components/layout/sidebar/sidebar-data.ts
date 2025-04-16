// src/components/layout/sidebar/sidebar-data.ts
// (Vẫn giữ nguyên cấu trúc sidebarData)
import { IconBug, IconHelp, IconLayoutDashboard, IconLockAccess, IconPalette, IconSettings, IconUser, IconUserCog, IconUserOff, IconUsers, IconReport, IconBusStop, IconBus, IconFlag, IconNotification } from '@tabler/icons-react'
import { Bus, CalendarCheck, MapPinPlus, Route } from 'lucide-react'
import { type SidebarData } from '@/components/layout/sidebar/sidebar-type'

export const sidebarData: SidebarData = {
  user: {
    name: 'chung',
    email: 'chung@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Trường Liên cấp...',
      logo: Bus,
      plan: 'BBus System',
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
              title: 'DS tuyến đường 2',
              url: '/transportation/routes2/list',
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
            {
              title: 'Lịch trình xe bus',
              url: '/buses/schedule',
              icon: MapPinPlus,
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
