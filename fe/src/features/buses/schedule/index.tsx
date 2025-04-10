import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import BusesProvider from '@/features/buses/context/buses-context'
import ScheduleProvider from '@/features/buses/context/schedule-context'
import MonthlyScheduleCalendar from './components/monthly-schedule-calendar'

export default function Schedule() {
  return (
    <BusesProvider>
      <ScheduleProvider>
        <Header fixed>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Lịch trình</h2>
              <p className='text-muted-foreground'>Hiển thị các tuyến và thời gian biểu các xe bus đang hoạt động</p>
            </div>
          </div>

          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <MonthlyScheduleCalendar />
          </div>
        </Main>
      </ScheduleProvider>
    </BusesProvider>
  )
}
