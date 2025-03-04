//path : src/components/common/profile-dropdown.tsx
import { Link } from '@tanstack/react-router'
// ✅ Lấy user từ API
import { extractUsername } from '@/helpers/extract-user-name'
import { useAuthQuery } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// ✅ Helper tách username

export function ProfileDropdown() {
  const { user, isLoading, logout } = useAuthQuery() // ✅ Lấy user từ TanStack Query

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@user' />
            <AvatarFallback>{user ? extractUsername(user.email).charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            {isLoading ? (
              <p className='text-sm font-medium leading-none'>Loading...</p>
            ) : user ? (
              <>
                <p className='text-sm font-medium leading-none'>{extractUsername(user.email)}</p>
                <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>Not logged in</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// src/components/common/profile-dropdown.tsx (unchanged)
// export function ProfileDropdown() {
//   const { user, isLoading, logout } = useAuthQuery()

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
//         {/* ... rest of the component unchanged ... */}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
