import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { Badge } from '@/components/mine/badge'
import { Status } from '@/components/mine/status'
import { statusLabels } from '@/features/buses/data'
import { Bus } from '@/features/buses/schema'
import { DataTableColumnHeader } from './table/data-table-column-header'
import { DataTableRowActions } from './table/data-table-row-actions'

// Define a component for empty values
const EmptyValueBadge = ({ text }: { text: string }) => <Badge color='yellow'>{text}</Badge>

export const columns: ColumnDef<Bus>[] = [
  // CỘT CHỌN DÒNG
  // {
  //   id: 'select',
  //   header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
  //   enableSorting: false,
  //   enableHiding: false,
  //   meta: {
  //     className: cn('sticky md:table-cell left-0 z-10 rounded-tl', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'),
  //   },
  // },

  // --- Cột số thứ tự ---
  {
    id: 'index',
    header: '#',
    cell: ({ row }) => {
      // Số thứ tự = index của row + 1
      return <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>
    },
    enableSorting: false,
    enableHiding: false,
    size: 40, // Đặt chiều rộng cột nhỏ hơn
  },

  // CÁC CỘT THÔNG TIN CHÍNH
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên xe buýt' />,
    cell: ({ row }) => <LongText className='max-w-40'>{row.getValue('name')}</LongText>,
    meta: { className: 'w-40' },
  },

  {
    accessorKey: 'licensePlate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Biển số xe' />,
    cell: ({ row }) => {
      const value = row.getValue('licensePlate')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Chưa có biển số' />
    },
  },

  {
    accessorKey: 'driverName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tài xế' />,
    cell: ({ row }) => {
      const value = row.getValue('driverName')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  {
    accessorKey: 'driverPhone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='SĐT tài xế' />,
    cell: ({ row }) => {
      const value = row.getValue('driverPhone')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  {
    accessorKey: 'assistantName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phụ xe' />,
    cell: ({ row }) => {
      const value = row.getValue('assistantName')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  {
    accessorKey: 'assistantPhone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='SĐT phụ xe' />,
    cell: ({ row }) => {
      const value = row.getValue('assistantPhone')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  {
    accessorKey: 'routeCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã tuyến' />,
    cell: ({ row }) => {
      const value = row.getValue('routeCode')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  // {
  //   accessorKey: 'espId',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='GPS ID' />,
  //   cell: ({ row }) => {
  //     const value = row.getValue('espId')
  //     return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
  //   },
  // },

  {
    accessorKey: 'cameraFacesluice',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Camera ID' />,
    cell: ({ row }) => {
      const value = row.getValue('cameraFacesluice')
      return value ? <div>{value as string}</div> : <EmptyValueBadge text='Trống' />
    },
  },

  {
    accessorKey: 'busStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.original.busStatus
      const statusLabel = statusLabels[status] || status // fallback
      return <Status color={status === 'ACTIVE' ? 'green' : 'red'}>{statusLabel}</Status>
    },
  },

  {
    accessorKey: 'amountOfStudents',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số học sinh' />,
    cell: ({ row }) => <div>{row.getValue('amountOfStudents')}</div>,
  },

  // CỘT HÀNH ĐỘNG
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
