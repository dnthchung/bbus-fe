'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RequestStatusBadge } from '../components/request-status-badge'

interface RequestTableProps {
  requests: any[]
  onViewRequest: (request: any) => void
}

export function RequestTable({ requests, onViewRequest }: RequestTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(requests.length / itemsPerPage)

  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Hàm để lấy ngày gửi đơn (có thể cần điều chỉnh tùy thuộc vào API)
  const getSubmissionDate = (request: any) => {
    // Giả định rằng API không trả về trường submissionDate cụ thể
    // Sử dụng fromDate hoặc một trường khác làm ngày gửi đơn
    return request.fromDate || new Date().toISOString().split('T')[0]
  }

  // Hàm để lấy nội dung rút gọn
  const getSummary = (request: any) => {
    return request.reason || 'Không có nội dung'
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>STT</TableHead>
            <TableHead>Học sinh</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead className='max-w-[300px]'>Nội dung rút gọn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className='text-right'>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request, index) => (
              <TableRow key={request.requestId}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell className='font-medium'>{request.studentName || `Người dùng: ${request.sendByUserId.substring(0, 8)}...`}</TableCell>
                <TableCell>{new Date(getSubmissionDate(request)).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className='max-w-[300px] truncate'>{getSummary(request)}</TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm' onClick={() => onViewRequest(request)}>
                    <Eye className='mr-2 h-4 w-4' />
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {requests.length > 0 && (
        <div className='flex items-center justify-between border-t px-4 py-2'>
          <div className='text-sm text-muted-foreground'>
            Hiển thị {paginatedRequests.length} / {requests.length} đơn
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' onClick={handlePreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='text-sm'>
              Trang {currentPage} / {totalPages || 1}
            </div>
            <Button variant='outline' size='sm' onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
