// fe/src/features/buses/list/components/buses-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { Bus } from '@/features/buses/data/schema'
import { DataTableColumnHeader } from './table/data-table-column-header'
import { DataTableRowActions } from './table/data-table-row-actions'

export const columns: ColumnDef<Bus>[] = [
  // CỘT CHỌN DÒNG
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn('sticky md:table-cell left-0 z-10 rounded-tl', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'),
    },
  },

  // CỘT TÊN XE
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên xe buýt' />,
    cell: ({ row }) => <LongText className='max-w-40'>{row.getValue('name')}</LongText>,
    meta: { className: 'w-40' },
  },

  // CỘT BIỂN SỐ
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Biển số xe' />,
    cell: ({ row }) => <div>{row.getValue('licensePlate')}</div>,
  },

  // CỘT TÊN TÀI XẾ
  {
    accessorKey: 'driverName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tài xế' />,
    cell: ({ row }) => <div>{row.getValue('driverName')}</div>,
  },

  // CỘT TUYẾN ĐƯỜNG
  {
    accessorKey: 'route',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tuyến đường' />,
    cell: ({ row }) => <LongText className='max-w-52'>{row.getValue('route')}</LongText>,
  },

  // CỘT ESP ID
  {
    accessorKey: 'espId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ESP ID' />,
    cell: ({ row }) => <div>{row.getValue('espId')}</div>,
  },

  // CỘT CAMERA ID
  {
    accessorKey: 'cameraFacesluice',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Camera ID' />,
    cell: ({ row }) => <div>{row.getValue('cameraFacesluice')}</div>,
  },

  // CỘT HÀNH ĐỘNG
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
