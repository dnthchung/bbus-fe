//path : fe/src/features/transportation/routes/index.tsx
import { useToast } from '@/hooks/use-toast'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { columns } from '../components/table/routes-columns'
import { RoutesTable } from '../components/table/routes-table'
import RoutesProvider, { useRoutes } from '../context/routes-context'

function RoutesContent() {
  const { routes, loading } = useRoutes()
  const { toast } = useToast()
  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách học sinh</h2>
            <p className='text-muted-foreground'>Quản lý thông tin học sinh đăng ký sử dụng dịch vụ xe bus.</p>
          </div>
          {/* <StudentsPrimaryButtons /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>{loading ? <div className='flex justify-center p-8'>Đang tải...</div> : <RoutesTable data={routes} columns={columns} />}</div>
      </Main>
    </>
  )
}

export default function Routes() {
  return (
    <RoutesProvider>
      <RoutesContent />
    </RoutesProvider>
  )
}
