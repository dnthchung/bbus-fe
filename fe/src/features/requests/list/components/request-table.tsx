'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/mine/badge'
import { RequestStatusBadge } from '../components/request-status-badge'

interface RequestTableProps {
  requests: any[]
  onViewRequest: (request: any) => void
}

export function RequestTable({ requests, onViewRequest }: RequestTableProps) {
  /* ---------------- State ---------------- */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  /* -------------- Pagination -------------- */
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

  /* -------------- Helpers -------------- */
  const getSubmissionDate = (request: any) => request.fromDate || new Date().toISOString().split('T')[0]

  const getSummary = (request: any) => request.reason || 'Không có nội dung'

  /* -------------- Render -------------- */
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader className='text-bold bg-muted/100 dark:bg-muted/20'>
          <TableRow>
            <TableHead className='w-[80px]'>STT</TableHead>
            <TableHead>Người gửi</TableHead>
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
                <TableCell>{request.sendByName || `Người dùng: ${request.sendByUserId.substring(0, 8)}...`}</TableCell>
                <TableCell className='font-medium'>
                  {request.studentName || (
                    <div className='flex items-center gap-2'>
                      <Badge variant='soft' color='yellow'>
                        Trống
                      </Badge>
                    </div>
                  )}
                </TableCell>
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
              <TableCell colSpan={7} className='h-24 text-center'>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ---------- Pagination footer ---------- */}
      {requests.length > 0 && (
        <div className='flex items-center justify-between border-t px-4 py-2'>
          {/* Thông tin tổng */}
          <div className='text-sm text-muted-foreground'>
            Hiển thị {paginatedRequests.length} / {requests.length} đơn
          </div>

          {/* Điều khiển phân trang + chọn kích thước trang */}
          <div className='flex items-center space-x-4'>
            {/* bộ chọn số hàng / trang */}
            <div className='flex items-center space-x-2'>
              <span className='whitespace-nowrap text-sm'>Số hàng / trang</span>
              <select
                className='rounded border px-2 py-1 text-sm dark:bg-[#0f172a]'
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1) // quay về trang đầu khi thay đổi
                }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* nút chuyển trang */}
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
        </div>
      )}
    </div>
  )
}
