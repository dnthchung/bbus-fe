'use client'

//path : fe/src/features/transportation/routes/list/index.tsx
import { useToast } from '@/hooks/use-toast'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import RouteMap from '@/features/transportation/routes/components/map/route-map'
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
        <div className='mb-4 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách tuyến đường</h2>
            <p className='text-muted-foreground'>Quản lý thông tin tuyến đường trên hệ thống</p>
          </div>
          {/* <StudentsPrimaryButtons /> */}
        </div>

        <div className='flex h-[calc(100vh-180px)] flex-col gap-4 lg:flex-row'>
          {/* Left side - Map */}
          <div className='h-[400px] w-full lg:h-full lg:w-1/2'>
            <RouteMap />
          </div>

          {/* Right side - Routes table */}
          <div className='h-full w-full overflow-auto lg:w-1/2'>{loading ? <div className='flex justify-center p-8'>Đang tải...</div> : <RoutesTable data={routes} columns={columns} />}</div>
        </div>
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
