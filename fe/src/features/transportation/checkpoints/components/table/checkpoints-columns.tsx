import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { checkpointStatuses, checkpointStatusLabels } from '../../data/data'
import { Checkpoint } from '../../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// Import từ data.ts

// 2) Định nghĩa các cột cho bảng Checkpoints
export const columns: ColumnDef<Checkpoint>[] = [
  // -- CỘT CHỌN ROW --
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
    meta: {
      className: cn('sticky md:table-cell left-0 z-10 rounded-tl', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'),
    },
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
    enableSorting: false,
    enableHiding: false,
  },

  // -- CỘT TÊN CHECKPOINT --
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên điểm dừng' />,
    cell: ({ row }) => {
      const checkpointName = row.getValue('name') as string
      return <LongText className='max-w-36'>{checkpointName}</LongText>
    },
    meta: { className: 'w-40' },
  },

  // -- CỘT MÔ TẢ CHECKPOINT --
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <LongText className='max-w-64'>{row.getValue('description')}</LongText>,
    meta: { className: 'w-64' },
  },

  // -- CỘT VĨ ĐỘ (Latitude) --
  {
    accessorKey: 'latitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vĩ độ' />,
    cell: ({ row }) => <div>{row.getValue('latitude')}</div>,
  },

  // -- CỘT KINH ĐỘ (Longitude) --
  {
    accessorKey: 'longitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kinh độ' />,
    cell: ({ row }) => <div>{row.getValue('longitude')}</div>,
  },

  // -- CỘT TRẠNG THÁI --
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor = checkpointStatuses.get(status) || 'bg-gray-100 text-gray-800' // Mặc định nếu không tìm thấy
      const statusLabel = checkpointStatusLabels.get(status) || status // fallback nếu không có nhãn tiếng Việt

      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {statusLabel}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },

  // -- CỘT NGÀY TẠO --
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('createdAt')).toLocaleDateString('vi-VN')
      return <div>{createdAt}</div>
    },
  },

  // -- CỘT NGÀY CẬP NHẬT --
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày cập nhật' />,
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue('updatedAt')).toLocaleDateString('vi-VN')
      return <div>{updatedAt}</div>
    },
  },

  // -- CỘT HÀNH ĐỘNG --
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
