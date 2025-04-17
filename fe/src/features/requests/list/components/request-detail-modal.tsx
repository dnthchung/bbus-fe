'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { getRequestById } from '../../function'
import { RequestStatusBadge } from './request-status-badge'

interface RequestDetailModalProps {
  request: any
  requestType: string
  onClose: () => void
  onApprove: (id: string, response: string) => void
  onReject: (id: string, response: string) => void
  onMarkAsRead: (id: string) => void
  onAutoProcess: (id: string) => void
  isProcessing?: boolean
}

export function RequestDetailModal({ request, requestType, onClose, onApprove, onReject, onMarkAsRead, onAutoProcess, isProcessing = false }: RequestDetailModalProps) {
  const [response, setResponse] = useState('')
  const [requestDetails, setRequestDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true)
        const details = await getRequestById(request.requestId)
        setRequestDetails(details)
      } catch (error) {
        console.error('Error fetching request details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequestDetails()
  }, [request.requestId])

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value)
  }

  // Sử dụng dữ liệu chi tiết nếu có, nếu không sử dụng dữ liệu từ danh sách
  const requestData = requestDetails || request
  const isPending = requestData.status === 'PENDING'

  // Xác định loại đơn dựa trên requestTypeName
  const getRequestTypeLabel = () => {
    const typeName = requestData.requestTypeName || ''
    if (typeName.includes('nghỉ học')) return 'leave'
    if (typeName.includes('đón/trả')) return 'pickup'
    return 'other'
  }

  const currentRequestType = requestType || getRequestTypeLabel()
  const isReport = currentRequestType === 'report'
  const isPickup = currentRequestType === 'pickup' || requestData.requestTypeName?.includes('đón/trả')

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Chi tiết đơn</DialogTitle>
            <Button variant='ghost' size='icon' className='absolute right-4 top-4' onClick={onClose}>
              <X className='h-4 w-4' />
              <span className='sr-only'>Đóng</span>
            </Button>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='h-6 w-2/3' />
            <Skeleton className='h-20 w-full' />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Chi tiết đơn</DialogTitle>
          <Button variant='ghost' size='icon' className='absolute right-4 top-4' onClick={onClose}>
            <X className='h-4 w-4' />
            <span className='sr-only'>Đóng</span>
          </Button>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='font-medium'>Học sinh:</div>
            <div className='col-span-3'>{requestData.studentName || `Người dùng: ${requestData.sendByUserId.substring(0, 8)}...`}</div>
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='font-medium'>Ngày gửi:</div>
            <div className='col-span-3'>{requestData.fromDate ? new Date(requestData.fromDate).toLocaleDateString('vi-VN') : 'Không có thông tin'}</div>
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='font-medium'>Loại đơn:</div>
            <div className='col-span-3'>{requestData.requestTypeName}</div>
          </div>

          {isPickup && requestData.checkpointName && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <div className='font-medium'>Điểm đón/trả mới:</div>
              <div className='col-span-3'>{requestData.checkpointName}</div>
            </div>
          )}

          {currentRequestType === 'leave' && requestData.fromDate && requestData.toDate && (
            <>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Từ ngày:</div>
                <div className='col-span-3'>{new Date(requestData.fromDate).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Đến ngày:</div>
                <div className='col-span-3'>{new Date(requestData.toDate).toLocaleDateString('vi-VN')}</div>
              </div>
            </>
          )}

          <div className='grid grid-cols-4 gap-4'>
            <div className='font-medium'>Nội dung:</div>
            <div className='col-span-3 whitespace-pre-wrap'>{requestData.reason}</div>
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='font-medium'>Trạng thái:</div>
            <div className='col-span-3'>
              <RequestStatusBadge status={requestData.status} />
            </div>
          </div>

          {requestData.reply && (
            <div className='grid grid-cols-4 gap-4'>
              <div className='font-medium'>Phản hồi:</div>
              <div className='col-span-3 whitespace-pre-wrap'>{requestData.reply}</div>
            </div>
          )}

          {isPending && !isReport && (
            <div className='grid grid-cols-1 gap-4'>
              <div className='font-medium'>Phản hồi:</div>
              <Textarea placeholder='Nhập phản hồi...' value={response} onChange={handleResponseChange} className='min-h-[100px]' disabled={isProcessing} />
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          {isReport ? (
            <Button onClick={() => onMarkAsRead(requestData.requestId)} disabled={isProcessing}>
              {isProcessing ? 'Đang xử lý...' : 'Đánh dấu đã xem'}
            </Button>
          ) : isPickup && isPending ? (
            <>
              <Button variant='outline' onClick={onClose} disabled={isProcessing}>
                Hủy
              </Button>
              <Button onClick={() => onAutoProcess(requestData.requestId)} disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : 'Tự động xử lý đơn'}
              </Button>
            </>
          ) : isPending ? (
            <>
              <Button variant='destructive' onClick={() => onReject(requestData.requestId, response)} disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : 'Từ chối'}
              </Button>
              <Button onClick={() => onApprove(requestData.requestId, response)} disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : 'Phê duyệt'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>Đóng</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
