// fe/src/features/users/components/users-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { Status } from '@/components/mine/status'
import { AvatarThumbnail } from '@/features/users/components/avatar-thumbnail'
import { userTypes, statusLabels } from '../data'
import { User } from '../schema'
import { DataTableColumnHeader } from './table/data-table-column-header'
import { DataTableRowActions } from './table/data-table-row-actions'

export const columns: ColumnDef<User>[] = [
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
  // -- CỘT HÌNH ẢNH --
  {
    accessorKey: 'avatar',
    header: 'Hình ảnh',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string
      return <AvatarThumbnail url={avatarUrl} alt='user-avatar' className='h-20 w-20' />
    },
    enableSorting: false,
  },
  // -- CỘT HỌ VÀ TÊN --
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
    cell: ({ row }) => {
      const fullName = row.getValue('name') as string
      return <LongText className='max-w-36'>{fullName}</LongText>
    },
    meta: { className: 'w-36' },
  },

  // -- CỘT EMAIL --
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('email')}</div>,
  },

  // -- CỘT SỐ ĐIỆN THOẠI --
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    enableSorting: false,
  },

  // -- CỘT TRẠNG THÁI TÀI KHOẢN --
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái tài khoản' />,
    cell: ({ row }) => {
      // Lấy status gốc, vd "ACTIVE"
      const status = row.original.status
      // Lấy nhãn tiếng Việt từ statusLabels
      const statusLabel = statusLabels[status] || status // fallback
      return (
        <div className='flex space-x-2'>
          <Status color={status === 'ACTIVE' ? 'green' : 'red'}>{statusLabel}</Status>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },

  // -- CỘT VAI TRÒ --
  {
    id: 'role',
    accessorFn: (row) => row.role ?? 'N/A', // Lấy role trực tiếp
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
    cell: ({ getValue }) => {
      const roleValue = getValue() as string // Ví dụ "TEACHER" hoặc "ADMIN"
      if (!roleValue || roleValue === 'N/A') {
        return <span className='text-sm'>N/A</span>
      }
      // Tìm userType tương ứng để hiển thị tên tiếng Việt
      const userType = userTypes.find((t) => t.value === roleValue)
      if (!userType) {
        return <span className='text-sm'>{roleValue}</span> // Nếu không tìm thấy, hiển thị role gốc
      }
      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && <userType.icon size={16} className='text-muted-foreground' />}
          <span className='text-sm'>{userType.labelVi}</span>
        </div>
      )
    },
    filterFn: (row, id, filterValues) => {
      const rowValue = row.getValue(id) as string
      return filterValues.includes(rowValue)
    },
  },
  // -- CỘT HÀNH ĐỘNG (thường là menu ... ) --
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
