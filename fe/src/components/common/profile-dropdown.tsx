// //path : src/components/common/profile-dropdown.tsx
// import { Link } from '@tanstack/react-router'
// import { extractUsername } from '@/helpers/extract-user-name'
// import { LogOut, Wrench } from 'lucide-react'
// import { useAuthQuery } from '@/hooks/use-auth'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// export function ProfileDropdown() {
//   const { user, isLoading, logout } = useAuthQuery()
//   // console.log('ProfileDropdown - call 1')
//   console.log(user)
//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger asChild>
//         <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
//           <Avatar className='h-8 w-8'>
//             <AvatarImage src='/avatars/01.png' alt='@user' />
//             <AvatarFallback>{user ? extractUsername(user.email).charAt(0).toUpperCase() : 'U'}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className='w-56' align='end' forceMount>
//         <DropdownMenuLabel className='font-normal'>
//           <div className='flex flex-col space-y-1'>
//             {isLoading ? (
//               <p className='text-sm font-medium leading-none'>Loading...</p>
//             ) : user ? (
//               <>
//                 <p className='text-sm font-medium leading-none'>{extractUsername(user.email)}</p>
//                 <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
//               </>
//             ) : (
//               <p className='text-sm text-muted-foreground'>Not logged in</p>
//             )}
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           {/* <DropdownMenuItem asChild>
//             <Link to='/settings'>
//               Hồ sơ
//               <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//             </Link>
//           </DropdownMenuItem> */}
//           <DropdownMenuItem asChild>
//             <Link to='/settings/account'>
//               Tài khoản
//               <DropdownMenuShortcut>
//                 <Wrench size={16} />
//               </DropdownMenuShortcut>
//             </Link>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={logout}>
//           Đăng xuất
//           <DropdownMenuShortcut>
//             <LogOut size={16} />
//           </DropdownMenuShortcut>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
// src/components/common/profile-dropdown.tsx
import { Link } from '@tanstack/react-router'
import { extractUsername } from '@/helpers/extract-user-name'
import { LogOut, Wrench } from 'lucide-react'
import { useAuthQuery } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const { user, isLoading, logout } = useAuthQuery()

  // Bạn có thể kiểm tra theo nhiều cách khác nhau:

  // Cách 1: Trả về sớm một số trạng thái:
  if (isLoading) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>Loading...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!user) {
    // Trường hợp fetch xong nhưng không có user (chưa đăng nhập hoặc token sai)
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className='ml-2 text-sm text-muted-foreground'>Not logged in</span>
      </Button>
    )
  }

  // Cách 2: Giữ cấu trúc dropdown, chỉ render label khác nhau khi chưa có user.
  // Tại đây user chắc chắn tồn tại, nên có thể đọc user.email thoải mái
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {/* Thay đổi ảnh user nếu bạn có url avatar thực tế, ở đây chỉ demo */}
            <AvatarImage src='/avatars/01.png' alt='@user' />
            <AvatarFallback>{extractUsername(user.email).charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{extractUsername(user.email)}</p>
            <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings/account'>
              Tài khoản
              <DropdownMenuShortcut>
                <Wrench size={16} />
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
