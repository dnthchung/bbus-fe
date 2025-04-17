'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
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
import { getAllRequest, getAllRequestType, processChangeCheckpoint, replyRequest } from '../function'
import { RequestDetailModal } from './components/request-detail-modal'
import { RequestTable } from './components/request-table'

// Định nghĩa các loại đơn dựa trên requestTypeId
const REQUEST_TYPES = {
  LEAVE: '7fba6d6c-137f-428c-958f-fe6160469be8', // Đơn xin nghỉ học
  PICKUP: 'a9f42863-57b4-4b82-91fb-227f82ecaa20', // Yêu cầu đổi điểm đón/trả
  OTHER: '5c8da669-43e7-4e20-91a2-d53234ddd2f0', // Đơn khác
}

export default function RequestContent() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState('leave')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [requestTypes, setRequestTypes] = useState<any[]>([])

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [requestsData, requestTypesData] = await Promise.all([getAllRequest(), getAllRequestType()])
        setRequests(requestsData)
        setRequestTypes(requestTypesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedRequest(null)
  }

  const handleExportExcel = () => {
    toast({
      title: 'Xuất file Excel',
      description: 'Đã xuất file Excel thành công',
    })
  }

  const handleAutoProcessAll = async () => {
    try {
      setIsProcessing(true)
      // Lấy tất cả các đơn đổi điểm đón/trả đang chờ duyệt
      const pendingPickupRequests = requests.filter((request) => request.requestTypeId === REQUEST_TYPES.PICKUP && request.status === 'PENDING')

      // Xử lý tuần tự từng đơn
      for (const request of pendingPickupRequests) {
        await processChangeCheckpoint(request.requestId)
      }

      toast({
        title: 'Xử lý tự động',
        description: `Đã xử lý tự động ${pendingPickupRequests.length} đơn thành công`,
      })

      // Refresh dữ liệu sau khi xử lý
      await refreshData()
    } catch (error) {
      console.error('Error processing all requests:', error)
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi xử lý tự động các đơn',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApproveRequest = async (id: string, response: string) => {
    try {
      setIsProcessing(true)
      await replyRequest(id, response, 'APPROVED')
      setIsDetailModalOpen(false)
      // Refresh dữ liệu sau khi phê duyệt
      await refreshData()
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectRequest = async (id: string, response: string) => {
    try {
      setIsProcessing(true)
      await replyRequest(id, response, 'REJECTED')
      setIsDetailModalOpen(false)
      // Refresh dữ liệu sau khi từ chối
      await refreshData()
    } catch (error) {
      console.error('Error rejecting request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      setIsProcessing(true)
      // Gọi API đánh dấu đã xem ở đây (nếu có)
      // Hiện tại chưa có API cụ thể cho chức năng này
      toast({
        title: 'Đánh dấu đã xem',
        description: 'Đã đánh dấu đơn đã xem thành công',
      })
      setIsDetailModalOpen(false)
      // Refresh dữ liệu sau khi đánh dấu đã xem
      await refreshData()
    } catch (error) {
      console.error('Error marking request as read:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAutoProcess = async (id: string) => {
    try {
      setIsProcessing(true)
      await processChangeCheckpoint(id)
      setIsDetailModalOpen(false)
      // Refresh dữ liệu sau khi xử lý tự động
      await refreshData()
    } catch (error) {
      console.error('Error auto processing request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const refreshData = async () => {
    try {
      setIsLoading(true)
      const requestsData = await getAllRequest()
      setRequests(requestsData)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Lọc các đơn theo loại và điều kiện tìm kiếm
  const filterRequests = (typeId: string) => {
    return requests.filter((request) => request.requestTypeId === typeId && (request.studentName ? request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) : request.sendByUserId && request.sendByUserId.toLowerCase().includes(searchQuery.toLowerCase())) && (!date || (request.fromDate && new Date(request.fromDate).toDateString() === date.toDateString()) || (request.submissionDate && new Date(request.submissionDate).toDateString() === date.toDateString())))
  }

  const leaveRequests = filterRequests(REQUEST_TYPES.LEAVE)
  const pickupRequests = filterRequests(REQUEST_TYPES.PICKUP)
  const otherRequests = filterRequests(REQUEST_TYPES.OTHER)
  // Đơn báo cáo - giả định là các đơn không thuộc 3 loại trên
  const reportRequests = requests.filter((request) => request.requestTypeId !== REQUEST_TYPES.LEAVE && request.requestTypeId !== REQUEST_TYPES.PICKUP && request.requestTypeId !== REQUEST_TYPES.OTHER)

  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='container mx-auto py-6'>
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
                  <Button variant='outline' className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleExportExcel} className='gap-2'>
              <Download className='h-4 w-4' />
              Xuất file Excel
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[300px] w-full' />
          </div>
        ) : (
          <Tabs defaultValue='leave' className='w-full' onValueChange={setCurrentTab}>
            <TabsList className='grid w-full grid-cols-4'>
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
                <Button onClick={handleAutoProcessAll} disabled={isProcessing}>
                  {isProcessing ? 'Đang xử lý...' : 'Tự động xử lý tất cả đơn'}
                </Button>
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

      {isDetailModalOpen && selectedRequest && <RequestDetailModal request={selectedRequest} requestType={currentTab} onClose={handleCloseModal} onApprove={handleApproveRequest} onReject={handleRejectRequest} onMarkAsRead={handleMarkAsRead} onAutoProcess={handleAutoProcess} isProcessing={isProcessing} />}
    </>
  )
}
