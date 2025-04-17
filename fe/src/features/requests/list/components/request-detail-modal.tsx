'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
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
}

export function RequestDetailModal({ request, requestType, onClose, onApprove, onReject, onMarkAsRead, onAutoProcess }: RequestDetailModalProps) {
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

  const requestData = requestDetails || request
  const isPending = requestData.status === 'PENDING'

  const getRequestTypeLabel = () => {
    const typeName = requestData.requestTypeName || ''
    if (typeName.includes('nghỉ học')) return 'leave'
    if (typeName.includes('đón/trả')) return 'pickup'
    if (typeName.includes('báo cáo')) return 'report'
    return 'other'
  }

  const currentRequestType = requestType || getRequestTypeLabel()
  const isReport = currentRequestType === 'report'
  const isPickup = currentRequestType === 'pickup' || requestData.requestTypeName?.includes('đón/trả')

  const formatDate = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Chi tiết đơn</DialogTitle>
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
        </DialogHeader>

        <div className='overflow-auto py-4'>
          <table className='w-full border border-gray-300 text-sm'>
            <tbody>
              <InfoRow label='Học sinh' value={requestData.studentName || `Người dùng: ${requestData.sendByUserId?.substring(0, 8)}...`} />
              <InfoRow label='Ngày gửi' value={formatDate(requestData.fromDate)} />
              <InfoRow label='Loại đơn' value={requestData.requestTypeName} />

              {isPickup && requestData.checkpointName && <InfoRow label='Điểm đón/trả mới' value={requestData.checkpointName} />}

              {currentRequestType === 'leave' && requestData.fromDate && requestData.toDate && (
                <>
                  <InfoRow label='Từ ngày' value={formatDate(requestData.fromDate)} />
                  <InfoRow label='Đến ngày' value={formatDate(requestData.toDate)} />
                </>
              )}

              <InfoRow label='Nội dung' value={requestData.reason} multiline />
              <InfoRow label='Trạng thái' value={<RequestStatusBadge status={requestData.status} />} />
              {requestData.reply && <InfoRow label='Phản hồi' value={requestData.reply} multiline />}
            </tbody>
          </table>

          {isPending && !isReport && (
            <div className='mt-4'>
              <div className='mb-1 font-medium'>Phản hồi:</div>
              <Textarea placeholder='Nhập phản hồi...' value={response} onChange={handleResponseChange} className='min-h-[100px]' />
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          {isReport ? (
            <Button onClick={() => onMarkAsRead(requestData.requestId)}>Đánh dấu đã xem</Button>
          ) : isPickup && isPending ? (
            <>
              <Button variant='outline' onClick={onClose}>
                Hủy
              </Button>
              <Button onClick={() => onAutoProcess(requestData.requestId)}>Tự động xử lý đơn</Button>
            </>
          ) : isPending ? (
            <>
              <Button variant='destructive' onClick={() => onReject(requestData.requestId, response)}>
                Từ chối
              </Button>
              <Button onClick={() => onApprove(requestData.requestId, response)}>Phê duyệt</Button>
            </>
          ) : (
            <Button onClick={onClose}>Đóng</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value, multiline = false }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <tr className='border-t border-gray-300'>
      <td className='w-1/3 whitespace-nowrap p-2 align-top font-medium'>{label}:</td>
      <td className={`p-2 ${multiline ? 'whitespace-pre-wrap break-words' : 'whitespace-nowrap'}`}>{value}</td>
    </tr>
  )
}
