// fe/src/features/students/components/students-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Status } from '@/components/mine/status'
import { AvatarThumbnail } from '@/features/students/components/avatar-thumbnail'
import { DataTableColumnHeader } from '@/features/students/components/table/data-table-column-header'
import { genderLabels, statusLabels, studentStatusClasses } from '../../data/data'
import { Student, StudentStatus } from '../../data/schema'
import { StudentsDataTableRowActions } from './data-table-row-actions'

// Hàm tiện ích format ngày dạng ISO -> DD/MM/YYYY
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export const columns: ColumnDef<Student>[] = [
  // --- Cột Checkbox chọn dòng ---
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Chọn dòng' className='translate-y-[2px]' />,
    enableSorting: false,
    enableHiding: false,
  },
  // --- Hình ảnh (avatar) ---
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hình ảnh' />,
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string
      return (
        <AvatarThumbnail
          url={avatarUrl}
          alt='student-avatar'
          // Tuỳ chỉnh kích thước
          className='h-16 w-16'
        />
      )
    },
    enableSorting: false,
  },
  // --- Họ và tên ---
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='max-w-[150px] truncate'>{name}</div>
    },
  },
  // --- Ngày sinh ---
  {
    accessorKey: 'dob',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày sinh' />,
    cell: ({ row }) => {
      const dob = row.getValue('dob') as string
      return <span>{formatDate(dob)}</span>
    },
  },
  // --- Giới tính ---
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giới tính' />,
    cell: ({ row }) => {
      const gender = row.getValue('gender') as keyof typeof genderLabels
      return <span>{genderLabels[gender]}</span>
    },
  },
  // --- Trạng thái sử dụng xe ---
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.original.status
      const label = statusLabels[status] || status

      return (
        <div className='flex space-x-2'>
          <Status color={status === 'ACTIVE' ? 'green' : 'red'}>{label}</Status>
        </div>
      )
    },
    // Cho phép lọc theo trạng thái
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },

    enableSorting: false,
  },
  // --- Địa chỉ ---
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return <div className='max-w-[200px] truncate'>{address}</div>
    },
  },
  // --- Tên phụ huynh ---
  {
    id: 'parentName', // Đặt id tùy ý, tránh trùng các cột khác
    accessorFn: (row) => row.parent?.name || '',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phụ huynh' />,
    cell: ({ row }) => {
      const value = row.getValue('parentName') as string
      return <span>{value}</span>
    },
  },
  // --- SĐT phụ huynh ---
  {
    id: 'parentPhone',
    accessorFn: (row) => row.parent?.phone || '',
    header: ({ column }) => <DataTableColumnHeader column={column} title='SĐT phụ huynh' />,
    cell: ({ row }) => {
      const value = row.getValue('parentPhone') as string
      return <span>{value}</span>
    },
  },
  // --- Row actions (sửa/xoá) ---
  {
    id: 'actions',
    cell: StudentsDataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
]
