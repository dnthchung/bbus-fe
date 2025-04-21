'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CheckpointsDialogs } from '@/features/transportation/checkpoints/components/checkpoints-dialogs'
import { useCheckpoints } from '@/features/transportation/checkpoints/context/checkpoints-context'
import { CheckpointMap } from './components/checkpoint-map'
import { CheckpointsPrimaryButtons } from './components/checkpoints-primary-buttons'
import { CheckpointsTable } from './components/checkpoints-table'
import CreateCheckpointPage from './components/page/create-checkpoint-page'
import { columns } from './components/table/checkpoints-columns'
import CheckpointsProvider from './context/checkpoints-context'
import type { Checkpoint } from './data/schema'

// Separate content component that uses the context
function CheckpointsContent() {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'map-table'>('table')

  const { checkpoints: checkpointList, loading, refreshCheckpoints } = useCheckpoints()

  const handleCheckpointClick = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint)
  }

  // Tạo phiên bản cột đã lọc (không có kinh độ và vĩ độ) cho chế độ xem bản đồ
  const filteredColumns = useMemo(() => {
    return columns.filter((column) => {
      // Kiểm tra cả id và accessorKey
      const columnId = 'id' in column ? column.id : undefined
      const accessorKey = 'accessorKey' in column ? column.accessorKey : undefined

      // Loại bỏ cột kinh độ, vĩ độ và cột select (checkbox)
      return columnId !== 'latitude' && columnId !== 'longitude' && columnId !== 'select' && accessorKey !== 'latitude' && accessorKey !== 'longitude'
    })
  }, [])

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
                <span className='text-muted-foreground'>Quản lý tuyến đường</span>{' '}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách các điểm dừng</BreadcrumbPage>
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
        <Tabs orientation='vertical' defaultValue='list' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='list'>Danh sách</TabsTrigger>
              <TabsTrigger value='create'>Tạo mới</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='list' className='space-y-4'>
            <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Quản lý điểm dừng xe bus</h2>
                <p className='text-muted-foreground'>Danh sách các điểm dừng xe bus cho dịch vụ đưa đón học sinh.</p>
              </div>
              <div className='flex items-center gap-2'>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'map-table')} className='w-[260px]'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='table'>Chỉ bảng</TabsTrigger>
                    <TabsTrigger value='map-table'>Bảng + Bản đồ</TabsTrigger>
                  </TabsList>
                </Tabs>
                <CheckpointsPrimaryButtons />
              </div>
            </div>

            {loading ? (
              <div className='flex justify-center p-8'>Đang tải...</div>
            ) : viewMode === 'table' ? (
              <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                <CheckpointsTable data={checkpointList} columns={columns} />
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Card className='lg:col-span-1'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-5 w-5 text-primary' />
                        Bản đồ điểm dừng
                      </div>
                    </CardTitle>
                    <CardDescription>Hiển thị vị trí các điểm dừng trên bản đồ</CardDescription>
                  </CardHeader>
                  <CardContent className='p-0'>
                    <CheckpointMap checkpoints={checkpointList} selectedCheckpoint={selectedCheckpoint} onCheckpointClick={handleCheckpointClick} height='600px' />
                  </CardContent>
                </Card>

                <Card className='lg:col-span-1'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>Danh sách điểm dừng</CardTitle>
                    <CardDescription>Quản lý thông tin chi tiết các điểm dừng</CardDescription>
                  </CardHeader>
                  <CardContent className='p-0 pt-6'>
                    <div className='flex h-[600px] flex-col'>
                      <div className='flex-grow overflow-auto'>
                        <CheckpointsTable columns={filteredColumns} data={checkpointList} onRowClick={handleCheckpointClick} highlightedRowId={selectedCheckpoint?.id} hideCheckboxes={true} className='flex h-full flex-col' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          {/* ====================================== */}
          <TabsContent value='create' className='space-y-4'>
            <div className='pb-4'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold tracking-tight'>Quản lý điểm dừng xe bus</h2>
                <p className='text-muted-foreground'>Tạo điểm dừng xe buýt mới</p>
              </div>
              <CreateCheckpointPage />
            </div>
          </TabsContent>
        </Tabs>
      </Main>
      <CheckpointsDialogs />
    </>
  )
}

// Main component that wraps the content with the provider
export default function Checkpoints() {
  return (
    <CheckpointsProvider>
      <CheckpointsContent />
    </CheckpointsProvider>
  )
}
