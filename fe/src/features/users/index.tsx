// fe/src/features/users/index.tsx
import { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { columns } from '@/features/users/components/users-columns'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersTable } from '@/features/users/components/users-table'
import UsersProvider, { useUsers } from '@/features/users/context/users-context'

// Wrapper component that uses the context
function UsersContent() {
  const { users, loading } = useUsers()
  const [title, setTitle] = useState('Danh sách người dùng')
  const [description, setDescription] = useState('Quản lý thông tin các tài khoản người dùng trong hệ thống.')
  // Add state for userRole
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('role') ?? '')

  useEffect(() => {
    const role = localStorage.getItem('role')
    // Update title, description and userRole based on role
    if (role === 'ADMIN') {
      setTitle('Danh sách người dùng')
      setDescription('Quản lý tài khoản người dùng trong hệ thống.')
    } else if (role === 'SYSADMIN') {
      setTitle('Danh sách quản trị viên')
      setDescription('Quản lý các tài khoản quản trị viên trong hệ thống.')
    } else {
      setTitle('Danh sách người dùng')
      setDescription('Quản lý tất cả tài khoản trong hệ thống.')
    }
    setUserRole(role ?? '')
  }, [])

  return (
    <>
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý người dùng</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{userRole === 'SYSADMIN' ? 'Danh sách quản trị viên' : 'Danh sách người dùng hệ thống'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
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
          {/* {loading ? (
            <div className='flex h-64 items-center justify-center'>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <UsersTable data={users} columns={columns} />
          )} */}
          {loading ? (
            <div className='w-full'>
              <div className='space-y-4'>
                {/* Skeleton header */}
                <div className='flex items-center justify-between'>
                  <div className='h-8 w-48 animate-pulse rounded-md bg-muted'></div>
                  <div className='h-8 w-32 animate-pulse rounded-md bg-muted'></div>
                </div>

                {/* Skeleton table */}
                <div className='rounded-md border'>
                  {/* Skeleton header row */}
                  <div className='flex border-b bg-muted/50 px-4 py-3'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className='mx-2 h-4 flex-1 animate-pulse rounded-md bg-muted'></div>
                      ))}
                  </div>

                  {/* Skeleton data rows */}
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className='flex items-center border-b px-4 py-4'>
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <div key={j} className='mx-2 h-4 flex-1 animate-pulse rounded-md bg-muted'></div>
                          ))}
                      </div>
                    ))}
                </div>
              </div>
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
