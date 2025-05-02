'use client'

import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from './data-table-column-header'

// Định nghĩa kiểu dữ liệu Route
export interface Route {
  id: string
  code: string
  description: string
  path?: string
  periodStart?: string
  periodEnd?: string
  status?: string
}

// Sửa lại định nghĩa cột với kiểu generic chính xác
export const columns: ColumnDef<Route, unknown>[] = [
  {
    id: 'index',
    header: ({ column }) => (
      <div className='flex items-center justify-center'>
        <DataTableColumnHeader column={column} title='#' />
      </div>
    ),
    cell: ({ row }) => {
      // Số thứ tự = index của row + 1
      return <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>
    },
    enableSorting: false,
    enableHiding: false,
    size: 50, // Đặt chiều rộng cột nhỏ hơn
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã tuyến' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('code')}</div>,
    enableSorting: true,
    sortingFn: 'alphanumeric',
    size: 50,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => {
      const value = row.getValue('description') as string

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='max-w-[100px] cursor-help truncate'>{value || '—'}</div>
            </TooltipTrigger>
            <TooltipContent className='max-w-[400px] whitespace-pre-wrap'>{value}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: true,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const rawDate = row.getValue('createdAt') as string
      const date = new Date(rawDate)
      const formatted = format(date, 'HH:mm - dd/MM/yyyy') // giờ:phút ngày/tháng/năm
      return <div className='font-medium'>{formatted}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày cập nhật' />,
    cell: ({ row }) => {
      const rawDate = row.getValue('updatedAt') as string
      const date = new Date(rawDate)
      const formatted = format(date, 'HH:mm - dd/MM/yyyy') // giờ:phút ngày/tháng/năm
      return <div className='font-medium'>{formatted}</div>
    },
    enableSorting: true,
  },
]
