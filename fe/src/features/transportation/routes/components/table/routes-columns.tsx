'use client'

import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
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
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã tuyến' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('code')}</div>,
    enableSorting: true,
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <div className='max-w-[300px] truncate'>{row.getValue('description') || '—'}</div>,
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
]
