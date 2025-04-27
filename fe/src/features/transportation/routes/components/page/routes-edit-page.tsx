//path url : fe/src/features/transportation/routes/components/page/routes-edit-page.tsx
import { useEffect, useState, useRef } from 'react'
import { Route } from '@/routes/_authenticated/transportation/routes/list/details/edit/$id'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Status } from '@/components/mine/status'
import { getAllCheckpointButNotInRoute, getRouteByRouteId, editRouteByRouteId } from '@/features/transportation/function'

export default function EditRouteManagement() {
  const { id } = Route.useParams()
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
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
                <span className='text-muted-foreground'>Quản lý tuyến đường</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/transportation/routes'>Danh sách tuyến đường</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết tuyến đường</BreadcrumbPage>
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
        <div className='flex h-full w-full items-center justify-center'>
          <div className='w-full max-w-3xl rounded-md border bg-background p-4 shadow-md'>
            <h1 className='text-2xl font-bold'>Chỉnh sửa tuyến đường {id}</h1>
          </div>
        </div>
      </Main>
    </>
  )
}
