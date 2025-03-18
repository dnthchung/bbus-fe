// fe/src/features/students/components/students-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AvatarThumbnail } from '@/features/students/components/avatar-thumbnail'
import { DataTableColumnHeader } from '@/features/students/components/table/data-table-column-header'
import { genderLabels, statusLabels, studentStatusClasses } from '../../data/data'
// Import your Student type + supporting data/maps
import { Student, StudentStatus } from '../../data/schema'
import { StudentsDataTableRowActions } from './data-table-row-actions'

// A small helper to format an ISO date string into DD/MM/YYYY
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
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
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
    enableSorting: false,
    enableHiding: false,
  },

  // Avatar
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hình ảnh' />,
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string
      return (
        <AvatarThumbnail
          url={avatarUrl}
          alt='student-avatar'
          // Tuỳ chỉnh kích thước ảnh
          className='h-16 w-16'
        />
      )
    },
    enableSorting: false,
  },

  // Mã học sinh
  // {
  //   accessorKey: 'rollNumber',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Mã học sinh' />,
  //   cell: ({ row }) => {
  //     const rollNumber = row.getValue('rollNumber') as string
  //     return <div className='font-medium'>{rollNumber}</div>
  //   },
  // },

  // Tên học sinh
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='max-w-[150px] truncate'>{name}</div>
    },
  },

  // Ngày sinh
  {
    accessorKey: 'dob',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày sinh' />,
    cell: ({ row }) => {
      const dob = row.getValue('dob') as string
      return <span>{formatDate(dob)}</span>
    },
  },

  // Giới tính
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giới tính' />,
    cell: ({ row }) => {
      const gender = row.getValue('gender') as keyof typeof genderLabels
      return <span>{genderLabels[gender]}</span>
    },
  },

  // Trạng thái sử dụng xe
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as StudentStatus
      const label = statusLabels[status]
      const className = studentStatusClasses.get(status) ?? ''
      return (
        <Badge variant='outline' className={cn(className)}>
          {label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      // Cho phép lọc theo trạng thái
      return value.includes(row.getValue(id))
    },
  },

  // Địa chỉ
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return <div className='max-w-[200px] truncate'>{address}</div>
    },
  },

  // Phụ huynh
  {
    accessorKey: 'parentName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phụ huynh' />,
    cell: ({ row }) => {
      const parentName = row.getValue('parentName') as string
      return <span>{parentName}</span>
    },
  },
  {
    accessorKey: 'parentPhone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='SĐT phụ huynh' />,
    cell: ({ row }) => {
      const parentPhone = row.getValue('parentPhone') as string
      return <span>{parentPhone}</span>
    },
  },

  // Checkpoint
  // {
  //   accessorKey: 'checkpointName',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Điểm dừng' />,
  //   cell: ({ row }) => {
  //     const checkpointName = row.getValue('checkpointName') as string
  //     return <span>{checkpointName}</span>
  //   },
  // },
  // {
  //   accessorKey: 'checkpointDescription',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả điểm dừng' />,
  //   cell: ({ row }) => {
  //     const checkpointDescription = row.getValue('checkpointDescription') as string
  //     return <div className='max-w-[200px] truncate'>{checkpointDescription}</div>
  //   },
  // },

  // Row actions (edit/delete etc.)
  {
    id: 'actions',
    cell: StudentsDataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
]
