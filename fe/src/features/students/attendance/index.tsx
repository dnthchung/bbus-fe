import { useState, useEffect } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AdvancedBusLoader } from '@/components/mine/loader/advanced-bus-loader'
import AttendanceDetails from './components/attendance-details'
import StudentList from './components/student-list'

//path : fe/src/features/students/attendance/index.tsx
export default function Attendance() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
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
                  <span className='text-muted-foreground'>Quản lý học sinh</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Lịch sử điểm danh</BreadcrumbPage>
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
          <div className='mb-4'>
            <h2 className='text-2xl font-bold tracking-tight'>Lịch sử điểm danh BBus</h2>
            <p className='text-muted-foreground'>Theo dõi điểm danh tự động của học sinh trên xe buýt thông qua camera AI.</p>
          </div>
          <div className='flex h-[calc(100vh-12rem)] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'>
            <AdvancedBusLoader size='xl' variant='primary' animation='drive' text='Đang tải dữ liệu điểm danh...' />
          </div>
        </Main>
      </>
    )
  }

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
                <span className='text-muted-foreground'>Quản lý học sinh</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Lịch sử điểm danh</BreadcrumbPage>
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
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Lịch sử điểm danh BBus</h2>
          <p className='text-muted-foreground'>Theo dõi điểm danh tự động của học sinh trên xe buýt thông qua camera AI.</p>
        </div>
        <div className='flex h-[calc(100vh-12rem)] flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 md:flex-row'>
          <div className='w-full rounded-l-lg border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:w-72'>
            <StudentList />
          </div>
          <div className='flex-1 overflow-auto p-4 md:p-6'>
            <AttendanceDetails />
          </div>
        </div>
      </Main>
    </>
  )
}
