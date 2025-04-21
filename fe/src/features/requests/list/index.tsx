'use client'

import type React from 'react'
import { format } from 'date-fns'
import { IconSearch } from '@tabler/icons-react'
import { vi } from 'date-fns/locale'
import { CalendarIcon, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { RequestsProvider, useRequests } from '../context/requests-context'
import { RequestDetailModal } from './components/request-detail-modal'
import { RequestTable } from './components/request-table'

function RequestContent() {
  const { searchQuery, setSearchQuery, selectedDate, setSelectedDate, currentTab, setCurrentTab, loading, open, currentRequest, handleCloseModal, handleApproveRequest, handleRejectRequest, handleMarkAsRead, handleAutoProcess, handleAutoProcessAll, handleViewRequest, leaveRequests, pickupRequests, otherRequests, reportRequests } = useRequests()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
  }

  return (
    <>
      {/* -------- Header -------- */}
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý yêu cầu</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <BreadcrumbPage>
                    {currentTab === 'leave' && 'Đơn xin nghỉ học'}
                    {currentTab === 'pickup' && 'Đổi điểm đón/trả'}
                    {currentTab === 'report' && 'Báo cáo'}
                    {currentTab === 'other' && 'Đơn khác'}
                  </BreadcrumbPage>
                </BreadcrumbPage>
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

      {/* -------- Main -------- */}
      <Main>
        {/* --- Tiêu đề + Thanh công cụ tìm kiếm --- */}
        <div className='mb-6 flex flex-wrap items-center justify-between space-y-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý đơn người dùng</h2>
            <p className='text-muted-foreground'>Quản lý thông tin đơn xin nghỉ học, đổi điểm đón/trả và các đơn khác của học sinh.</p>
          </div>
          <div className='flex flex-col gap-4 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
            {/* --- Tìm kiếm & Chọn ngày --- */}
            <div className='flex flex-1 items-center space-x-2'>
              {/* ô tìm kiếm */}
              <div className='relative w-full max-w-sm'>
                <IconSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input type='search' placeholder='Tìm kiếm theo tên học sinh...' className='pl-8' value={searchQuery} onChange={handleSearch} />
              </div>

              {/* bộ chọn ngày */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className={cn('w-[240px] justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={selectedDate} onSelect={setSelectedDate} initialFocus />

                  {/* Nút xoá lọc ngày */}
                  {selectedDate && (
                    <Button variant='ghost' size='sm' className='mt-2 w-full' onClick={() => setSelectedDate(undefined)}>
                      Xoá lọc ngày
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* nút xuất excel */}
            <Button onClick={handleExportExcel} className='gap-2'>
              <Download className='h-4 w-4' />
              Xuất file Excel
            </Button>
          </div>
        </div>

        {/* --- Nội dung bảng dữ liệu --- */}
        {loading ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[300px] w-full' />
          </div>
        ) : (
          <Tabs defaultValue='leave' className='w-full' onValueChange={setCurrentTab}>
            <TabsList className='grid w-1/2 grid-cols-4'>
              <TabsTrigger value='leave'>Đơn xin nghỉ học</TabsTrigger>
              <TabsTrigger value='pickup'>Đổi điểm đón/trả</TabsTrigger>
              <TabsTrigger value='report'>Báo cáo</TabsTrigger>
              <TabsTrigger value='other'>Đơn khác</TabsTrigger>
            </TabsList>

            <TabsContent value='leave'>
              <RequestTable requests={leaveRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='pickup'>
              {/* <div className='mb-4 flex justify-end'>
                <Button onClick={handleAutoProcessAll}>Tự động xử lý tất cả đơn</Button>
              </div> */}
              <RequestTable requests={pickupRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='report'>
              <RequestTable requests={reportRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='other'>
              <RequestTable requests={otherRequests} onViewRequest={handleViewRequest} />
            </TabsContent>
          </Tabs>
        )}
      </Main>

      {/* --- Modal chi tiết đơn --- */}
      {open === 'view' && currentRequest && <RequestDetailModal request={currentRequest} requestType={currentTab} onClose={handleCloseModal} onApprove={handleApproveRequest} onReject={handleRejectRequest} onMarkAsRead={handleMarkAsRead} onAutoProcess={handleAutoProcess} />}
    </>
  )
}

export default function Requests() {
  return (
    <RequestsProvider>
      <RequestContent />
    </RequestsProvider>
  )
}
