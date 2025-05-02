// path: fe/src/features/transportation/checkpoints/list/table/checkpoints-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/common/long-text'
import { Badge } from '@/components/mine/badge'
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

export const columns: ColumnDef<Checkpoint>[] = [
  {
    id: 'index',
    header: () => <div className='text-center text-sm text-muted-foreground'>#</div>,
    cell: ({ row }) => <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10 text-center' }, // Giữ kích thước nhỏ
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên điểm dừng' />,
    cell: ({ row }) => <LongText className='max-w-[160px]'>{row.getValue('name')}</LongText>,
    meta: { className: 'w-48' },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <LongText className='max-w-[180px]'>{row.getValue('description')}</LongText>,
    meta: { className: 'w-52' },
  },
  {
    accessorKey: 'latitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vĩ độ' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('latitude')}</div>,
    meta: { className: 'w-32 text-center' },
  },
  {
    accessorKey: 'longitude',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kinh độ' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('longitude')}</div>,
    meta: { className: 'w-32 text-center' },
  },
  {
    accessorKey: 'amountOfStudent',
    header: ({ column }) => (
      <div className='flex justify-center'>
        <DataTableColumnHeader column={column} title='Số học sinh' />
      </div>
    ),
    cell: ({ row }) => {
      const studentCount = row.getValue('amountOfStudent') as number
      const badgeColor = studentCount > 0 ? 'green' : 'blue'
      return (
        <div className='flex justify-center'>
          <Badge color={badgeColor} size='sm' variant='soft'>
            {studentCount}
          </Badge>
        </div>
      )
    },
    meta: { className: 'w-24 text-center' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className='flex justify-center'>
        <DataTableColumnHeader column={column} title='Trạng thái' />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const label = checkpointStatusLabels.get(status) || status
      const color = checkpointStatusColors[status] || 'gray'
      return (
        <div className='flex justify-center'>
          <Status color={color}>{label}</Status>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    meta: { className: 'w-40 text-center' },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: { className: 'w-16 text-center' },
  },
]

// // ✅ Cột bảng Checkpoints
// export const columns: ColumnDef<Checkpoint>[] = [
//   {
//     id: 'index',
//     header: () => <div className='text-center text-sm text-muted-foreground'>#</div>,
//     cell: ({ row }) => {
//       // Số thứ tự = index của row + 1
//       return <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>
//     },
//     enableSorting: false,
//     enableHiding: false,
//     size: 40, // Đặt chiều rộng cột nhỏ hơn
//   },
//   {
//     accessorKey: 'name',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Tên điểm dừng' />,
//     cell: ({ row }) => {
//       const checkpointName = row.getValue('name') as string
//       return <LongText className='max-w-36'>{checkpointName}</LongText>
//     },
//     meta: { className: 'w-40' },
//   },
//   {
//     accessorKey: 'description',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
//     cell: ({ row }) => <LongText className='max-w-40'>{row.getValue('description')}</LongText>,
//     meta: { className: 'w-20' },
//   },
//   {
//     accessorKey: 'latitude',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Vĩ độ' />,
//     cell: ({ row }) => <div>{row.getValue('latitude')}</div>,
//   },
//   {
//     accessorKey: 'longitude',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Kinh độ' />,
//     cell: ({ row }) => <div>{row.getValue('longitude')}</div>,
//   },
//   {
//     accessorKey: 'amountOfStudent',
//     header: ({ column }) => (
//       <div className='flex justify-center'>
//         <DataTableColumnHeader column={column} title='Số học sinh' />
//       </div>
//     ),
//     cell: ({ row }) => {
//       const studentCount = row.getValue('amountOfStudent') as number
//       const badgeColor = studentCount > 0 ? 'green' : 'blue'
//       return (
//         <div className='flex justify-center'>
//           <Badge color={badgeColor} size='sm' variant='soft'>
//             {studentCount}
//           </Badge>
//         </div>
//       )
//     },
//   },

//   {
//     accessorKey: 'status',
//     header: ({ column }) => (
//       <div className='flex justify-center'>
//         <DataTableColumnHeader column={column} title='Trạng thái' />
//       </div>
//     ),
//     cell: ({ row }) => {
//       const status = row.original.status
//       const label = checkpointStatusLabels.get(status) || status
//       const color = checkpointStatusColors[status] || 'gray'

//       return (
//         <div className='flex justify-center'>
//           <Status color={color}>{label}</Status>
//         </div>
//       )
//     },
//     filterFn: (row, id, value) => value.includes(row.getValue(id)),
//     enableHiding: false,
//   },

//   {
//     id: 'actions',
//     cell: DataTableRowActions,
//   },
// ]
