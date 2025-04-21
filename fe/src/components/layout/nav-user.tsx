//path : fe/src/components/layout/nav-user.tsx
import { Link } from '@tanstack/react-router'
import { IconUserCog } from '@tabler/icons-react'
import { extractUsername } from '@/helpers/extract-user-name'
import { Bell, ChevronsUpDown, LogOut, Palette, User } from 'lucide-react'
import { useAuthQuery } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, isLoading, logout } = useAuthQuery()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarFallback className='rounded-lg'>...</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Đang tải ...</span>
              <span className='truncate text-xs'>Đang lấy dữ liệu người dùng...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const avatarSrc = user?.avatar || '/avatars/01.png'
  const fallbackChar = user ? extractUsername(user.email).charAt(0).toUpperCase() : 'U'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={avatarSrc} alt={user?.email || '@user'} />
                <AvatarFallback className='rounded-lg'>{fallbackChar}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.name || 'Guest'}</span>
                <span className='truncate text-xs'>{user?.email || 'guest@example.com'}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg' side={isMobile ? 'bottom' : 'right'} align='end' sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={avatarSrc} alt={user?.email || '@user'} />
                  <AvatarFallback className='rounded-lg'>{fallbackChar}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.name || 'Guest'}</span>
                  <span className='truncate text-xs'>{user?.email || 'guest@example.com'}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings'>
                  <IconUserCog /> Hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings/appearance'>
                  <Palette /> Giao diện
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link to='/settings/notifications'>
                  <Bell /> Thông báo
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className='cursor-pointer'>
              <LogOut /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
