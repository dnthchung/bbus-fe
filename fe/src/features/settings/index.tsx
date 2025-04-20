// path: fe/src/features/settings/index.tsx
import { Outlet } from '@tanstack/react-router'
import { IconPalette, IconUser } from '@tabler/icons-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      {/* ===== Header with Breadcrumb ===== */}
      <Header fixed>
        <div className='flex w-full items-center justify-between'>
          {/* Left: Breadcrumb */}
          <Breadcrumb className='hidden lg:flex'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cài đặt</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Right: Search + Controls */}
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      <Main fixed>
        {/* ===== Heading ===== */}
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Cài đặt</h1>
          <p className='text-muted-foreground'>Quản lý cài đặt tài khoản và thiết lập tùy chọn email.</p>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Hồ sơ',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  // {
  //   title: 'Tài khoản',
  //   icon: <IconTool size={18} />,
  //   href: '/settings/account',
  // },
  {
    title: 'Giao diện',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  // {
  //   title: 'Thông báo',
  //   icon: <IconNotification size={18} />,
  //   href: '/settings/notifications',
  // },
]
