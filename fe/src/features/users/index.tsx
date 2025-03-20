// fe/src/features/users/index.tsx
import { useEffect, useState } from 'react'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { User } from './data/schema'
import { getAllUsers, getAllUsersRoleParent } from './data/users'

// <-- hàm mới

export default function Users() {
  const [userList, setUserList] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Gọi hàm getAllUsers
        const parsedUsers = await getAllUsers()
        const parentUsers = await getAllUsersRoleParent()
        console.log('1. Parsed users:', parsedUsers)
        console.log('2. Parent users:', parentUsers)
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
              <h2 className='text-2xl font-bold tracking-tight'>DS người dùng</h2>
              <p className='text-muted-foreground'>Quản lý thông tin các tài khoản người dùng trong hệ thống.</p>
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
