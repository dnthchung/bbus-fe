// path : fe/src/features/students/index.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StudentsDialogs } from '@/features/students/components/students-dialogs'
import { StudentsPrimaryButtons } from '@/features/students/components/students-primary-buttons'
import { StudentsTable } from '@/features/students/components/students-table'
import { columns } from './components/table/students-columns'
import StudentsProvider, { useStudents } from './context/students-context'

function StudentsContent() {
  const { students, loading } = useStudents()

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
                <span className='text-muted-foreground'>Học sinh</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách học sinh</BreadcrumbPage>
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
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách thông tin học sinh</h2>
            <p className='text-muted-foreground'>Quản lý thông tin học sinh đăng ký sử dụng dịch vụ xe bus.</p>
          </div>
          <StudentsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>{loading ? <div className='flex justify-center p-8'>Đang tải...</div> : <StudentsTable data={students} columns={columns} />}</div>
      </Main>
      <StudentsDialogs />
    </>
  )
}

export default function Students() {
  return (
    <StudentsProvider>
      <StudentsContent />
    </StudentsProvider>
  )
}
