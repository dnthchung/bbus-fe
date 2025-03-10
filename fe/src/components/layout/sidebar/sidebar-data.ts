// //path : fe/src/components/layout/data/sidebar-data.ts
// import { IconBarrierBlock, IconBrowserCheck, IconBug, IconChecklist, IconError404, IconHelp, IconLayoutDashboard, IconLock, IconLockAccess, IconNotification, IconPackages, IconPalette, IconServerOff, IconSettings, IconTool, IconUserCog, IconUserOff, IconUsers } from '@tabler/icons-react'
// import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
// import { type SidebarData } from '@/components/layout/sidebar/sidebar-type'
// export const sidebarData: SidebarData = {
//   user: {
//     name: 'chung',
//     email: 'chung@gmail.com',
//     avatar: '/avatars/shadcn.jpg',
//   },
//   teams: [
//     { name: 'Shadcn Admin', logo: Command, plan: 'Vite + ShadcnUI' },
//     { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
//     { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
//   ],
//   navGroups: [
//     {
//       title: 'General',
//       items: [
//         { title: 'Dashboard', url: '/', icon: IconLayoutDashboard },
//         { title: 'Users', url: '/users', icon: IconUsers },
//         { title: 'Tasks', url: '/tasks', icon: IconChecklist },
//         { title: 'Apps', url: '/apps', icon: IconPackages },
//       ],
//     },
//     {
//       title: 'Pages',
//       items: [
//         {
//           title: 'Auth',
//           icon: IconLockAccess,
//           items: [
//             { title: 'Sign In', url: '/sign-in' },
//             { title: 'Sign In (2 Col)', url: '/sign-in-2' },
//             { title: 'Sign Up', url: '/sign-up' },
//             { title: 'Forgot Password', url: '/forgot-password' },
//             { title: 'OTP', url: '/otp' },
//           ],
//         },
//         {
//           title: 'Errors',
//           icon: IconBug,
//           items: [
//             { title: 'Unauthorized', url: '/401', icon: IconLock },
//             { title: 'Forbidden', url: '/403', icon: IconUserOff },
//             { title: 'Not Found', url: '/404', icon: IconError404 },
//             {
//               title: 'Internal Server Error',
//               url: '/500',
//               icon: IconServerOff,
//             },
//             { title: 'Maintenance Error', url: '/503', icon: IconBarrierBlock },
//           ],
//         },
//       ],
//     },
//     {
//       title: 'Other',
//       items: [
//         {
//           title: 'Settings',
//           icon: IconSettings,
//           items: [
//             { title: 'Profile', url: '/settings', icon: IconUserCog },
//             { title: 'Account', url: '/settings/account', icon: IconTool },
//             {
//               title: 'Appearance',
//               url: '/settings/appearance',
//               icon: IconPalette,
//             },
//             {
//               title: 'Notifications',
//               url: '/settings/notifications',
//               icon: IconNotification,
//             },
//             {
//               title: 'Display',
//               url: '/settings/display',
//               icon: IconBrowserCheck,
//             },
//           ],
//         },
//         { title: 'Help Center', url: '/help-center', icon: IconHelp },
//       ],
//     },
//   ],
// }
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
            { title: 'Tài khoản', url: '/settings/account', icon: IconTool },
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
