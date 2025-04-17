// fe/src/features/transportation/routes/components/table/routes-columns.tsx
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { Route } from '@/features/transportation/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Route>[] = [
  // // -- CỘT CHỌN ROW --
  // {
  //   id: 'select',
  //   header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
  //   meta: {
  //     className: cn('sticky md:table-cell left-0 z-10 rounded-tl', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'),
  //   },
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  // -- CỘT MÃ TUYẾN ĐƯỜNG --
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã tuyến' />,
    cell: ({ row }) => {
      const code = row.getValue('code') as string
      return <div className='font-medium'>{code}</div>
    },
    meta: { className: 'w-24' },
  },

  // -- CỘT MÔ TẢ --
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả tuyến đường' />,
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return <LongText className='max-w-60'>{description}</LongText>
    },
    meta: { className: 'w-60' },
  },

  // // -- CỘT THỜI GIAN BẮT ĐẦU --
  // {
  //   accessorKey: 'periodStart',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày bắt đầu' />,
  //   cell: ({ row }) => {
  //     const date = row.getValue('periodStart') as string
  //     // Format date if it's valid
  //     try {
  //       const formattedDate = format(new Date(date), 'dd/MM/yyyy', { locale: vi })
  //       return <div>{formattedDate}</div>
  //     } catch (error) {
  //       return <div>{date}</div>
  //     }
  //   },
  //   meta: { className: 'w-32' },
  // },

  // // -- CỘT THỜI GIAN KẾT THÚC --
  // {
  //   accessorKey: 'periodEnd',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày kết thúc' />,
  //   cell: ({ row }) => {
  //     const date = row.getValue('periodEnd') as string
  //     // Format date if it's valid
  //     try {
  //       const formattedDate = format(new Date(date), 'dd/MM/yyyy', { locale: vi })
  //       return <div>{formattedDate}</div>
  //     } catch (error) {
  //       return <div>{date}</div>
  //     }
  //   },
  //   meta: { className: 'w-32' },
  // },

  // -- CỘT ĐƯỜNG ĐI (PATH) --
  {
    accessorKey: 'path',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điểm dừng' />,
    cell: ({ row }) => {
      const path = row.getValue('path') as string
      const checkpointCount = path.split(' ').filter(Boolean).length
      return (
        <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700'>
          {checkpointCount} điểm
        </Badge>
      )
    },
    meta: { className: 'w-28' },
  },

  // -- CỘT HÀNH ĐỘNG --
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: { className: 'w-14' },
  },
]
