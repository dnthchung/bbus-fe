'use client'

import type React from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
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
    // Implement Excel export functionality
  }

  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='container mx-auto mt-20 py-6'>
        <div className='mb-6 flex flex-col space-y-4'>
          <h1 className='text-2xl font-bold'>Quản lý đơn người dùng</h1>

          <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
            <div className='flex flex-1 items-center space-x-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input type='search' placeholder='Tìm kiếm theo tên học sinh...' className='pl-8' value={searchQuery} onChange={handleSearch} />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className={cn('w-[240px] justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleExportExcel} className='gap-2'>
              <Download className='h-4 w-4' />
              Xuất file Excel
            </Button>
          </div>
        </div>

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
              <TabsTrigger value='other'>Đơn khác</TabsTrigger>
              <TabsTrigger value='report'>Đơn báo cáo</TabsTrigger>
            </TabsList>

            <TabsContent value='leave'>
              <RequestTable requests={leaveRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='pickup'>
              <div className='mb-4 flex justify-end'>
                <Button onClick={handleAutoProcessAll}>Tự động xử lý tất cả đơn</Button>
              </div>
              <RequestTable requests={pickupRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='other'>
              <RequestTable requests={otherRequests} onViewRequest={handleViewRequest} />
            </TabsContent>

            <TabsContent value='report'>
              <RequestTable requests={reportRequests} onViewRequest={handleViewRequest} />
            </TabsContent>
          </Tabs>
        )}
      </Main>

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
