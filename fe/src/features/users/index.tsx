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
import UsersProvider, { useUsers } from '@/features/users/context/users-context'
// Create a wrapper component that uses the context
function UsersContent() {
  const { users, loading } = useUsers()
  const [title, setTitle] = useState('Danh sách người dùng')
  const [description, setDescription] = useState('Quản lý thông tin các tài khoản người dùng trong hệ thống.')
  
  useEffect(() => {
    // Update title and description based on user role
    const userRole = localStorage.getItem('role')
    if (userRole === 'ADMIN') {
      setTitle('Danh sách người dùng')
      setDescription('Quản lý tài khoản người dùng trong hệ thống.')
    } else if (userRole === 'SYSADMIN') {
      setTitle('Danh sách quản trị viên')
      setDescription('Quản lý các tài khoản quản trị viên trong hệ thống.')
    } else {
      setTitle('Danh sách người dùng')
      setDescription('Quản lý tất cả tài khoản trong hệ thống.')
    }
  }, [])

  return (
    <>
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <UsersTable data={users} columns={columns} />
          )}
        </div>
      </Main>
      <UsersDialogs />
    </>
  )
}

// Main component that provides the context
export default function Users() {
  return (
    <UsersProvider>
      <UsersContent />
    </UsersProvider>
  )
}
