// fe/src/features/students/components/students-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
  // // --- Cột Checkbox chọn dòng ---
  // {
  //   id: 'select',
  //   header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Chọn tất cả' className='translate-y-[2px]' />,
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
  // --- Lớp học ---
  {
    accessorKey: 'className',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Lớp' />,
    cell: ({ row }) => {
      const className = row.getValue('className') as string
      return <span>{className}</span>
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

  // --- Địa chỉ ---
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='max-w-[100px] cursor-default truncate'>{address}</div>
            </TooltipTrigger>
            <TooltipContent className='max-w-sm text-xs'>{address}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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
  // Thêm vào trước cột actions
  // --- Ngày tạo ---
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      if (!createdAt) return <span>-</span>

      // Xử lý đúng định dạng timestamp MongoDB
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='cursor-default'>{formatDate(createdAt)}</div>
            </TooltipTrigger>
            <TooltipContent className='text-xs'>
              {new Date(createdAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    sortingFn: 'datetime',
    enableHiding: true,
  },
  // --- Ngày cập nhật ---
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày cập nhật' />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string
      if (!updatedAt) return <span>-</span>

      // Xử lý đúng định dạng timestamp MongoDB
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='cursor-default'>{formatDate(updatedAt)}</div>
            </TooltipTrigger>
            <TooltipContent className='text-xs'>
              {new Date(updatedAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    sortingFn: 'datetime',
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
  // --- Row actions (sửa/xoá) ---
  {
    id: 'actions',
    cell: StudentsDataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
]
