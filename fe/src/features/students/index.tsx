//path : fe/src/features/students/index.tsx
// import { Search } from 'lucide-react'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StudentsDialogs } from '@/features/students/components/dialog/students-dialogs'
import { StudentsPrimaryButtons } from '@/features/students/components/students-primary-buttons'
import { StudentsTable } from '@/features/students/components/students-table'
import { columns } from './components/table/students-columns'
import StudentsProvider from './context/students-context'
import { studentListSchema } from './data/schema'
import { students } from './data/students'

export default function Students() {
  const studentList = studentListSchema.parse(students)
  //localhost:8080/user/list?page=1&size=20

  return (
    <StudentsProvider>
      <Header fixed>
        {/* <Search /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>DS học sinh</h2>
            <p className='text-muted-foreground'>Quản lý thông tin học sinh đăng ký sử dụng dịch vụ xe bus.</p>
          </div>
          <StudentsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <StudentsTable data={studentList} columns={columns} />
        </div>
      </Main>

      <StudentsDialogs />
    </StudentsProvider>
  )
}
