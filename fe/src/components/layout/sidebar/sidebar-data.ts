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
import { IconBarrierBlock, IconBrowserCheck, IconBug, IconChecklist, IconError404, IconHelp, IconLayoutDashboard, IconLock, IconLockAccess, IconNotification, IconPackages, IconPalette, IconServerOff, IconSettings, IconTool, IconUserCog, IconUserOff, IconUsers, IconRobot } from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '@/components/layout/sidebar/sidebar-type'

export const sidebarData: SidebarData = {
  user: {
    name: 'chung',
    email: 'chung@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    { name: 'Shadcn Admin', logo: Command, plan: 'Vite + ShadcnUI' },
    { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        { title: 'Bảng điều khiển', url: '/', icon: IconLayoutDashboard },
        // { title: 'Users', url: '/users', icon: IconUsers },
        // { title: 'Tasks', url: '/tasks', icon: IconChecklist },
        // { title: 'Apps', url: '/apps', icon: IconPackages },
      ],
    },
    {
      title: 'Quản lý',
      items: [
        { title: 'Quản lý TK người dùng', url: '/users', icon: IconLockAccess },
        { title: 'Quản lý học sinh', url: '/students', icon: IconUsers },
        {
          title: 'Quản lý tài khoản',
          icon: IconLockAccess,
          items: [
            { title: 'Phụ huynh', url: '/sign-in' },
            { title: 'Giáo viên', url: '/sign-in-2' },
            { title: 'Lái xe', url: '/sign-up' },
            { title: 'Phụ xe', url: '/forgot-password' },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            { title: 'Unauthorized', url: '/401', icon: IconLock },
            { title: 'Forbidden', url: '/403', icon: IconUserOff },
            { title: 'Not Found', url: '/404', icon: IconError404 },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            { title: 'Maintenance Error', url: '/503', icon: IconBarrierBlock },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            { title: 'Profile', url: '/settings', icon: IconUserCog },
            { title: 'Account', url: '/settings/account', icon: IconTool },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        { title: 'Help Center', url: '/help-center', icon: IconHelp },
      ],
    },
  ],
}
