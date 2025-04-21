'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useRequests } from '../../context/requests-context'
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
  const { processing } = useRequests()
  const [response, setResponse] = useState('')
  const [isResponseError, setIsResponseError] = useState(false)
  const maxResponseLength = 3000
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
    const value = e.target.value
    if (value.length <= maxResponseLength) {
      setResponse(value)
    }
    setIsResponseError(value.trim() === '')
  }

  // Kiểm tra hợp lệ trước khi gửi
  const validateAndSubmit = (action: 'approve' | 'reject') => {
    if (!response.trim()) {
      setIsResponseError(true)
      return
    }

    if (action === 'approve') {
      onApprove(requestData.requestId, response)
    } else {
      onReject(requestData.requestId, response)
    }
  }

  const requestData = requestDetails || request
  const isPending = requestData.status === 'PENDING'
  const isApproved = requestData.status === 'APPROVED'

  /* ----------------- Helpers ----------------- */
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

  // Ngày gửi – ưu tiên createdAt, sau đó fromDate
  const getSubmissionDate = () => requestData.createdAt || requestData.createdDate || requestData.submissionDate || requestData.fromDate

  /* -------------- Loading skeleton -------------- */
  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='bg-white dark:bg-[#0f172a] sm:max-w-[500px]'>
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

  /* ------------------ Render ------------------ */
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='bg-white dark:bg-[#0f172a] sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Chi tiết đơn</DialogTitle>
          <DialogDescription className='flex justify-between text-sm text-muted-foreground'>
            <span className='mb-2'>{requestData.requestTypeName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* ---------- Bảng thông tin ---------- */}
        <div className='py-4'>
          <table className='w-full overflow-hidden rounded border border-gray-300 text-sm dark:border-gray-600'>
            <tbody>
              <InfoRow label='Học sinh' value={requestData.studentName || `Người dùng: ${requestData.sendByUserId?.substring(0, 8)}...`} />
              <InfoRow label='Ngày gửi' value={formatDate(getSubmissionDate())} />
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

          {/* Ô phản hồi (ẩn khi đã duyệt hoặc là đơn report) */}
          {!isReport && isPending && (
            <div className='mt-4'>
              <div className='mb-1 flex justify-between'>
                <span className='font-medium'>Phản hồi:</span>
                <span className={`text-xs ${response.length > maxResponseLength * 0.9 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {response.length}/{maxResponseLength}
                </span>
              </div>
              <Textarea placeholder='Nhập phản hồi...' value={response} onChange={handleResponseChange} className={`min-h-[100px] ${isResponseError ? 'border-red-500 focus-visible:ring-red-500' : ''}`} disabled={!isPending || processing} />
              {isResponseError && <p className='mt-1 text-xs text-red-500'>Vui lòng nhập phản hồi trước khi phê duyệt hoặc từ chối</p>}
            </div>
          )}
        </div>

        {/* ---------- Action buttons ---------- */}
        <div className='flex justify-end gap-2'>
          {isReport ? (
            <Button onClick={() => onMarkAsRead(requestData.requestId)} disabled={processing}>
              {processing ? 'Đang xử lý...' : 'Đánh dấu đã xem'}
            </Button>
          ) : isPickup && isPending ? (
            <>
              <Button variant='outline' onClick={onClose} disabled={processing}>
                Hủy
              </Button>
              <Button onClick={() => onAutoProcess(requestData.requestId)} disabled={processing}>
                {processing ? 'Đang xử lý...' : 'Tự động xử lý đơn'}
              </Button>
            </>
          ) : isPending ? (
            <>
              <Button variant='destructive' onClick={() => validateAndSubmit('reject')} disabled={processing || response.trim() === ''}>
                {processing ? 'Đang xử lý...' : 'Từ chối'}
              </Button>
              <Button onClick={() => validateAndSubmit('approve')} disabled={processing || response.trim() === ''}>
                {processing ? 'Đang xử lý...' : 'Phê duyệt'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} disabled={processing}>
              Đóng
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -------- Row helper -------- */
function InfoRow({ label, value, multiline = false }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <tr className='border-t border-gray-300 dark:border-gray-600'>
      <td className='w-1/3 whitespace-nowrap bg-gray-100 p-2 align-top text-sm font-medium dark:bg-gray-800'>{label}:</td>
      <td className={`p-2 text-sm ${multiline ? 'whitespace-pre-wrap break-words' : 'whitespace-nowrap'}`}>{value}</td>
    </tr>
  )
}
