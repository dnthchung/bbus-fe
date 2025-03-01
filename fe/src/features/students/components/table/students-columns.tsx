// fe/src/features/students/components/students-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AvatarThumbnail } from '@/features/students/components/avatar-thumbnail'
import { DataTableColumnHeader } from '@/features/students/components/table/data-table-column-header'
import { busServiceStatuses } from '../../data/data'
// Import the Student type and the busServiceStatuses map
import { Student, BusServiceStatus } from '../../data/schema'
import { StudentsDataTableRowActions } from './data-table-row-actions'

// A small date formatter for birthDate column
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export const columns: ColumnDef<Student>[] = [
  // Checkbox column for row selection
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' className='translate-y-[2px]' />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' className='translate-y-[2px]' />,
    enableSorting: false,
    enableHiding: false,
  },

  // Student ID (UUID)
  // {
  //   accessorKey: 'studentId',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Mã học sinh' />,
  //   cell: ({ row }) => {
  //     const studentId = row.getValue('studentId') as string
  //     return <div className='font-mono text-xs'>{studentId}</div>
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },

  // Avatar
  {
    accessorKey: 'avatar',
    header: 'Hình ảnh',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string

      return (
        <AvatarThumbnail
          url={avatarUrl}
          alt='student-avatar'
          // Ở đây tuỳ biến kích thước thumbnail: 16x16 (Tailwind: h-16 w-16)
          className='h-48 w-48'
        />
      )
    },
    enableSorting: false,
  },

  // Full name
  {
    accessorKey: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
    cell: ({ row }) => {
      const fullName = row.getValue('fullName') as string
      return <div className='max-w-[150px] truncate'>{fullName}</div>
    },
  },

  // Birth date
  {
    accessorKey: 'birthDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày sinh' />,
    cell: ({ row }) => {
      const date = row.getValue('birthDate') as Date
      return <span>{formatDate(date)}</span>
    },
  },

  // Grade (1-9)
  {
    accessorKey: 'grade',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Khối' />,
    cell: ({ row }) => {
      const grade = row.getValue('grade') as number
      return <span>{grade}</span>
    },
  },

  // Class (e.g. 1A, 5D, 9J)
  {
    accessorKey: 'class',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Lớp' />,
    cell: ({ row }) => {
      const className = row.getValue('class') as string
      return <span>{className}</span>
    },
  },

  // Bus service status (e.g. Đang sử dụng / Tạm ngừng sử dụng)
  {
    accessorKey: 'busServiceStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const busStatus = row.getValue('busServiceStatus') as BusServiceStatus
      const badgeColor = busServiceStatuses.get(busStatus)
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {busStatus}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      // example filter: we check if the row's status is in the selected filters
      return value.includes(row.getValue(id))
    },
  },

  // Row actions (edit/delete etc.)
  {
    id: 'actions',
    cell: StudentsDataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
]
