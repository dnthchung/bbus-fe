import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import BusRoutePlanner from './components/map/BusRoutePlanner'

export default function Schedules() {
  return (
    <>
      <Header fixed className='z-[1000]'>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      {/* Changed to relative positioning and removed overflow-auto from Main */}
      <Main className='relative mt-20'>
        <div className='mx-4 mb-6'>
          <h2 className='text-2xl font-bold'>Lịch trình</h2>
          <p>Hiển thị các tuyến xe bus đang hoạt động</p>
        </div>
        <div>
          <BusRoutePlanner />
        </div>
      </Main>
    </>
  )
}
