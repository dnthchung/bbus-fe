import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import AttendanceDetails from './components/attendance-details'
import StudentList from './components/student-list'

export default function Attendance() {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
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
