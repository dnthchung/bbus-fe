// fe/src/features/users/index.tsx
import { useEffect, useState } from 'react'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { columns } from '@/features/users/components/users-columns'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersTable } from '@/features/users/components/users-table'
import UsersProvider from '@/features/users/context/users-context'
import { User } from '@/features/users/schema'
import { getAllUsers, getAllUsersExceptAdmins, getAllAdminUsers } from '@/features/users/users'

export default function Users() {
  const [userList, setUserList] = useState<User[]>([])
  const [title, setTitle] = useState('Danh sách người dùng')
  const [description, setDescription] = useState('Quản lý thông tin các tài khoản người dùng trong hệ thống.')
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        //check role user login to system is admin or sysadmin
        const userRole = localStorage.getItem('role')
        //với ADMIN => lấy toàn bộ user TRỪ các tài khoản có role là ADMIN và SYSADMIN
        //với SYSADMIN => lấy toàn bộ user CÓ role là ADMIN và SYSADMIN
        let parsedUsers: User[] = []
        if (userRole === 'ADMIN') {
          console.log('fetch all users except admins')
          parsedUsers = await getAllUsersExceptAdmins()
          setTitle('Danh sách người dùng')
          setDescription('Quản lý tài khoản người dùng trong hệ thống.')
        } else if (userRole === 'SYSADMIN') {
          console.log('fetch all admin users')
          parsedUsers = await getAllAdminUsers()
          setTitle('Danh sách quản trị viên')
          setDescription('Quản lý các tài khoản quản trị viên trong hệ thống.')
        } else {
          parsedUsers = await getAllUsers()
          setTitle('Danh sách người dùng')
          setDescription('Quản lý tất cả tài khoản trong hệ thống.')
        }


        setUserList(parsedUsers)
      } catch (error) {
        console.error('Error fetching users in index.tsx:', error)
      }
    }
    fetchUsers()
  }, [])

  return (
    <>
      <UsersProvider>
        <Header fixed>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground'>{description}</p>
          </div>
            <UsersPrimaryButtons />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <UsersTable data={userList} columns={columns} />
          </div>
        </Main>
        <UsersDialogs />
      </UsersProvider>
    </>
  )
}
