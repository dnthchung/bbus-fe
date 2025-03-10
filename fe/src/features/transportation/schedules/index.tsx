import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import BusRoutePlanner from './components/map/BusRoutePlanner'

export default function Schedules() {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='overflow-y-auto pt-[80px]'>
        <div>
          <BusRoutePlanner />
        </div>
      </Main>
    </>
  )
}
