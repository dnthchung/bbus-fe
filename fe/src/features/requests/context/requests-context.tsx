'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { getAllRequest, getAllRequestType, replyRequest, processChangeCheckpoint } from '../function'

// Định nghĩa các loại dialog
type RequestsDialogType = 'view' | 'approve' | 'reject' | 'read' | 'autoProcess'

// Định nghĩa kiểu dữ liệu cho request
interface Request {
  requestId: string
  requestTypeId: string
  requestTypeName: string
  studentId: string | null
  studentName: string | null
  sendByUserId: string
  checkpointId: string | null
  checkpointName: string | null
  approvedByUserId: string | null
  approvedByName: string | null
  fromDate: string | null
  toDate: string | null
  reason: string
  reply: string | null
  status: string
  submissionDate?: string // Thêm thuộc tính submissionDate
}

// Định nghĩa kiểu dữ liệu cho request type
interface RequestType {
  requestTypeId: string
  requestTypeName: string
}

// Định nghĩa các loại đơn dựa trên requestTypeId
const REQUEST_TYPES = {
  LEAVE: '7fba6d6c-137f-428c-958f-fe6160469be8', // Đơn xin nghỉ học
  PICKUP: 'a9f42863-57b4-4b82-91fb-227f82ecaa20', // Yêu cầu đổi điểm đón/trả
  OTHER: '5c8da669-43e7-4e20-91a2-d53234ddd2f0', // Đơn khác
}

// Định nghĩa context type
interface RequestsContextType {
  // Dialog state
  open: RequestsDialogType | null
  setOpen: (type: RequestsDialogType | null) => void

  // Current request
  currentRequest: Request | null
  setCurrentRequest: React.Dispatch<React.SetStateAction<Request | null>>

  // Data state
  requests: Request[]
  requestTypes: RequestType[]
  loading: boolean
  processing: boolean
  error: Error | null

  // Filter state
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  currentTab: string
  setCurrentTab: (tab: string) => void

  // Actions
  refreshRequests: () => Promise<void>
  handleViewRequest: (request: Request) => void
  handleCloseModal: () => void
  handleApproveRequest: (id: string, reply: string) => Promise<void>
  handleRejectRequest: (id: string, reply: string) => Promise<void>
  handleMarkAsRead: (id: string) => Promise<void>
  handleAutoProcess: (id: string) => Promise<void>
  handleAutoProcessAll: () => Promise<void>

  // Filtered requests
  leaveRequests: Request[]
  pickupRequests: Request[]
  otherRequests: Request[]
  reportRequests: Request[]
}

// Create context
const RequestsContext = createContext<RequestsContextType | null>(null)

// Provider component
interface RequestsProviderProps {
  children: React.ReactNode
}

export function RequestsProvider({ children }: RequestsProviderProps) {
  const { toast } = useToast()

  // Dialog state
  const [open, setOpen] = useState<RequestsDialogType | null>(null)

  // Current request
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null)

  // Data state
  const [requests, setRequests] = useState<Request[]>([])
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentTab, setCurrentTab] = useState('leave')

  // Fetch data on mount
  useEffect(() => {
    refreshRequests()
  }, [])

  // Refresh requests data
  const refreshRequests = async () => {
    try {
      setLoading(true)
      const [requestsData, requestTypesData] = await Promise.all([getAllRequest(), getAllRequestType()])
      setRequests(requestsData)
      setRequestTypes(requestTypesData)
      setError(null)
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu đơn. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle view request
  const handleViewRequest = (request: Request) => {
    setCurrentRequest(request)
    setOpen('view')
  }

  // Handle close modal
  const handleCloseModal = () => {
    setOpen(null)
    setCurrentRequest(null)
  }

  // Handle approve request
  const handleApproveRequest = async (id: string, reply: string) => {
    try {
      setProcessing(true)
      await replyRequest(id, reply, 'APPROVED')
      await refreshRequests()
      handleCloseModal()
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Handle reject request
  const handleRejectRequest = async (id: string, reply: string) => {
    try {
      setProcessing(true)
      await replyRequest(id, reply, 'REJECTED')
      await refreshRequests()
      handleCloseModal()
    } catch (error) {
      console.error('Error rejecting request:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      setProcessing(true)
      // Assuming there's an API for marking as read
      // For now, we'll just show a toast
      toast({
        title: 'Đánh dấu đã xem',
        description: 'Đã đánh dấu đơn đã xem thành công',
      })
      await refreshRequests()
      handleCloseModal()
    } catch (error) {
      console.error('Error marking request as read:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Handle auto process
  const handleAutoProcess = async (id: string) => {
    try {
      setProcessing(true)
      await processChangeCheckpoint(id)
      await refreshRequests()
      handleCloseModal()
    } catch (error) {
      console.error('Error auto processing request:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Handle auto process all
  const handleAutoProcessAll = async () => {
    try {
      setProcessing(true)
      // Get all pending pickup requests
      const pendingPickupRequests = requests.filter((req) => req.requestTypeId === REQUEST_TYPES.PICKUP && req.status === 'PENDING')

      // Process each request
      await Promise.all(pendingPickupRequests.map((req) => processChangeCheckpoint(req.requestId)))

      toast({
        title: 'Xử lý tự động',
        description: 'Đã xử lý tự động tất cả đơn thành công',
      })

      await refreshRequests()
    } catch (error) {
      console.error('Error auto processing all requests:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý tự động tất cả đơn. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  // Cập nhật hàm filterRequests để xử lý trường hợp submissionDate có thể undefined
  const filterRequests = (typeId: string) => {
    return requests.filter((request) => request.requestTypeId === typeId && (request.studentName ? request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) : request.sendByUserId && request.sendByUserId.toLowerCase().includes(searchQuery.toLowerCase())) && (!selectedDate || (request.fromDate && new Date(request.fromDate).toDateString() === selectedDate.toDateString()) || (request.submissionDate && new Date(request.submissionDate).toDateString() === selectedDate.toDateString())))
  }

  // Filtered requests
  const leaveRequests = filterRequests(REQUEST_TYPES.LEAVE)
  const pickupRequests = filterRequests(REQUEST_TYPES.PICKUP)
  const otherRequests = filterRequests(REQUEST_TYPES.OTHER)
  const reportRequests = requests.filter((request) => request.requestTypeId !== REQUEST_TYPES.LEAVE && request.requestTypeId !== REQUEST_TYPES.PICKUP && request.requestTypeId !== REQUEST_TYPES.OTHER)

  return (
    <RequestsContext.Provider
      value={{
        open,
        setOpen,
        currentRequest,
        setCurrentRequest,
        requests,
        requestTypes,
        loading,
        processing,
        error,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,
        currentTab,
        setCurrentTab,
        refreshRequests,
        handleViewRequest,
        handleCloseModal,
        handleApproveRequest,
        handleRejectRequest,
        handleMarkAsRead,
        handleAutoProcess,
        handleAutoProcessAll,
        leaveRequests,
        pickupRequests,
        otherRequests,
        reportRequests,
      }}
    >
      {children}
    </RequestsContext.Provider>
  )
}

// Hook to use the context
export function useRequests() {
  const context = useContext(RequestsContext)
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider')
  }
  return context
}
