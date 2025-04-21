// path: fe/src/features/transportation/checkpoints/list/table/checkpoints-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { Status } from '@/components/mine/status'
import { checkpointStatusLabels } from '../../data/data'
import { Checkpoint, CheckpointStatus } from '../../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// ✅ Màu trạng thái tương ứng với Status component
const checkpointStatusColors: Record<CheckpointStatus, 'green' | 'red'> = {
  ACTIVE: 'green',
  INACTIVE: 'red',
}

// ✅ Cột bảng Checkpoints
export const columns: ColumnDef<Checkpoint>[] = [
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
  // --- Cột số thứ tự ---
  {
    id: 'index',
    header: () => <div className='text-center text-sm text-muted-foreground'>#</div>,
    cell: ({ row }) => {
      // Số thứ tự = index của row + 1
      return <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>
    },
    enableSorting: false,
    enableHiding: false,
    size: 40, // Đặt chiều rộng cột nhỏ hơn
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên điểm dừng' />,
    cell: ({ row }) => {
      const checkpointName = row.getValue('name') as string
      return <LongText className='max-w-36'>{checkpointName}</LongText>
    },
    meta: { className: 'w-40' },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <LongText className='max-w-64'>{row.getValue('description')}</LongText>,
    meta: { className: 'w-64' },
  },
  {
    accessorKey: 'latitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vĩ độ' />,
    cell: ({ row }) => <div>{row.getValue('latitude')}</div>,
  },
  {
    accessorKey: 'longitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kinh độ' />,
    cell: ({ row }) => <div>{row.getValue('longitude')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.original.status
      const label = checkpointStatusLabels.get(status) || status
      const color = checkpointStatusColors[status] || 'gray'

      return <Status color={color}>{label}</Status>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
