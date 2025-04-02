//path : fe/src/features/buses/list/index.tsx
import { useEffect, useState } from 'react'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import BusesProvider from '@/features/buses/context/buses-context'
import { getAllBuses } from '@/features/buses/function'
import { columns } from '@/features/buses/list/components/buses-columns'
import { BusesDialogs } from '@/features/buses/list/components/buses-dialogs'
import { BusesPrimaryButtons } from '@/features/buses/list/components/buses-primary-buttons'
import { BusesTable } from '@/features/buses/list/components/buses-table'
import { Bus } from '@/features/buses/schema'

export default function BusList() {
  const [busList, setBusList] = useState<Bus[]>([])

  useEffect(() => {
    async function fetchBuses() {
      try {
        const data = await getAllBuses()
        setBusList(data)
      } catch (error) {
        console.error('Error fetching buses in index.tsx:', error)
      }
    }
    fetchBuses()
  }, [])

  return (
    <BusesProvider>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách xe buýt</h2>
            <p className='text-muted-foreground'>Quản lý thông tin các xe buýt trong hệ thống.</p>
          </div>
          <BusesPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <BusesTable data={busList} columns={columns} />
        </div>
      </Main>

      <BusesDialogs />
    </BusesProvider>
  )
}
