//path : fe/src/components/layout/data/sidebar-data.ts
import { IconBug, IconHelp, IconLayoutDashboard, IconLockAccess, IconPalette, IconSettings, IconTool, IconUserCog, IconUserOff, IconUsers, IconReport, IconBusStop, IconBus, IconFlag, IconNotification } from '@tabler/icons-react'
import { Bus, CalendarCheck, MapPinPlus, Route } from 'lucide-react'
import { type SidebarData } from '@/components/layout/sidebar/sidebar-type'

export const sidebarData: SidebarData = {
  user: {
    name: 'chung',
    email: 'chung@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    { name: 'Trường Liên cấp THCS & Tiểu học Tư thục Ngôi Sao Hà Nội', logo: Bus, plan: 'BBus System ' },
    // { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
    // { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [{ title: 'Bảng điều khiển', url: '/', icon: IconLayoutDashboard }],
    },
    {
      title: 'Quản lý',
      items: [
        { title: 'Quản lý TK người dùng', url: '/users', icon: IconLockAccess },
        { title: 'Quản lý học sinh', url: '/students', icon: IconUsers },
        {
          title: 'Quản lý tuyến đường',
          // icon: IconBusStop,
          icon: Route,
          items: [
            { title: 'DS tuyến đường', url: '/transportation/routes', icon: MapPinPlus },
            { title: 'Lịch trình', url: '/transportation/schedules', icon: CalendarCheck },
            { title: 'DS các điểm dừng', url: '/transportation/checkpoints', icon: IconBusStop },
          ],
        },
        // thêm quản lý danh sách xe bus
        { title: 'Quản lý xe bus', url: '/buses', icon: IconBus },
        {
          title: 'Quản lý báo cáo', // code sau
          icon: IconReport,
          items: [
            { title: 'DS báo cáo', url: '/401', icon: IconFlag },
            { title: 'Báo cáo điểm danh', url: '/403', icon: IconUserOff },
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
            { title: 'Hồ sơ', url: '/settings', icon: IconUserCog },
            // { title: 'Tài khoản', url: '/settings/account', icon: IconTool },
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
        { title: 'Trợ giúp', url: '/help-center', icon: IconHelp },
        { title: 'Báo cáo', url: '/help-center', icon: IconBug },
      ],
    },
  ],
}
