// src/components/common/profile-dropdown.tsx
import { Link } from '@tanstack/react-router'
import { extractUsername } from '@/helpers/extract-user-name'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useAuthQuery } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const { user, isLoading, logout } = useAuthQuery()

  // Lấy role từ user hoặc localStorage
  const role = user?.role ?? localStorage.getItem('role') ?? 'Người dùng'

  if (isLoading) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>Đang tải...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!user) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className='ml-2 text-sm text-muted-foreground'>Not logged in</span>
      </Button>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.avatar || '/avatars/01.png'} alt={user.username || '@user'} />
            <AvatarFallback>{extractUsername(user.email).charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          {/* <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <div className='flex items-center justify-between space-x-2'>
              <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
              <p className='text-xs leading-none text-muted-foreground'>{role === 'ADMIN' ? 'Quản trị viên' : role === 'SYSADMIN' ? 'Quản trị hệ thống' : 'Người dùng'}</p>
            </div>
          </div> */}
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <div className='flex flex-wrap items-center gap-1'>
              <p className='break-all text-xs leading-none text-muted-foreground'>{user.email}</p>
              <span className='rounded-md bg-secondary px-1.5 py-0.5 text-xs leading-none text-muted-foreground'>{role === 'ADMIN' ? 'Quản trị viên' : role === 'SYSADMIN' ? 'Quản trị hệ thống' : 'Người dùng'}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Hồ sơ
              <DropdownMenuShortcut>
                <UserIcon size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Đăng xuất
          <DropdownMenuShortcut>
            <LogOut size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
