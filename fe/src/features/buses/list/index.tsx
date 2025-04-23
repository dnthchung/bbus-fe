//path : fe/src/features/buses/list/index.tsx
import { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getAllBuses } from '@/features/buses/buses'
import BusesProvider from '@/features/buses/context/buses-context'
import { columns } from '@/features/buses/list/components/buses-columns'
import { BusesDialogs } from '@/features/buses/list/components/buses-dialogs'
import { BusesPrimaryButtons } from '@/features/buses/list/components/buses-primary-buttons'
import { BusesTable } from '@/features/buses/list/components/buses-table'
import { Bus } from '@/features/buses/schema'

export default function BusList() {
  const [busList, setBusList] = useState<Bus[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchBuses() {
      try {
        setLoading(true)
        const data = await getAllBuses()
        console.log('Data:', data)
        setBusList(data)
      } catch (error) {
        console.error('Error fetching buses in index.tsx:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBuses()
  }, [])

  return (
    <BusesProvider>
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý xe bus</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách xe bus</BreadcrumbPage>
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
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách xe buýt</h2>
            <p className='text-muted-foreground'>Quản lý thông tin các xe buýt trong hệ thống.</p>
          </div>
          <BusesPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className='w-full'>
              <div className='space-y-4'>
                {/* Skeleton header */}
                <div className='flex items-center justify-between'>
                  <div className='h-8 w-48 animate-pulse rounded-md bg-muted'></div>
                  <div className='h-8 w-32 animate-pulse rounded-md bg-muted'></div>
                </div>

                {/* Skeleton table */}
                <div className='rounded-md border'>
                  {/* Skeleton header row */}
                  <div className='flex border-b bg-muted/50 px-4 py-3'>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className='mx-2 h-4 flex-1 animate-pulse rounded-md bg-muted'></div>
                      ))}
                  </div>

                  {/* Skeleton data rows */}
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className='flex items-center border-b px-4 py-4'>
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <div key={j} className='mx-2 h-4 flex-1 animate-pulse rounded-md bg-muted'></div>
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <BusesTable data={busList} columns={columns} />
          )}
        </div>
      </Main>

      <BusesDialogs />
    </BusesProvider>
  )
}
