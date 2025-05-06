import { ColumnDef } from '@tanstack/react-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import LongText from '@/components/common/long-text'
import { Status } from '@/components/mine/status'
import { AvatarThumbnail } from '@/features/users/components/avatar-thumbnail'
import { userTypes, statusLabels } from '../data'
import { User } from '../schema'
import { DataTableColumnHeader } from './table/data-table-column-header'
import { DataTableRowActions } from './table/data-table-row-actions'

// Format ngày
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export const columns: ColumnDef<User>[] = [
  // --- STT ---
  {
    id: 'index',
    header: () => <div className='text-center text-sm text-muted-foreground'>#</div>,
    cell: ({ row }) => <div className='text-center text-sm text-muted-foreground'>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10 text-center' },
  },

  // --- Hình ảnh ---
  {
    accessorKey: 'avatar',
    header: 'Hình ảnh',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string
      return <AvatarThumbnail url={avatarUrl} alt='user-avatar' className='h-14 w-14' />
    },
    enableSorting: false,
    meta: { className: 'w-20 text-center' },
  },

  // --- Họ và tên ---
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
    cell: ({ row }) => {
      const fullName = row.getValue('name') as string
      return <LongText className='max-w-[160px]'>{fullName}</LongText>
    },
    meta: { className: 'w-44' },
  },

  // --- Email ---
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div className='max-w-[200px] truncate'>{row.getValue('email')}</div>,
    meta: { className: 'w-52' },
  },

  // --- Số điện thoại ---
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    enableSorting: true,
    meta: { className: 'w-36' },
  },

  // --- Vai trò ---
  {
    id: 'role',
    accessorFn: (row) => row.role ?? 'N/A',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
    cell: ({ getValue }) => {
      const roleValue = getValue() as string
      const userType = userTypes.find((t) => t.value === roleValue)
      return (
        <div className='flex items-center gap-2'>
          {userType?.icon && <userType.icon size={16} className='text-muted-foreground' />}
          <span>{userType?.labelVi || roleValue}</span>
        </div>
      )
    },
    filterFn: (row, id, filterValues) => {
      const rowValue = row.getValue(id) as string
      return filterValues.includes(rowValue)
    },
    meta: { className: 'w-44' },
  },

  // --- Ngày cập nhật ---
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày cập nhật' />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string
      if (!updatedAt) return <span>-</span>
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
    meta: { className: 'w-32 text-center' },
  },

  // --- Trạng thái tài khoản ---
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái tài khoản' />,
    cell: ({ row }) => {
      const status = row.original.status
      const statusLabel = statusLabels[status] || status
      return (
        <div className='flex justify-center'>
          <Status color={status === 'ACTIVE' ? 'green' : 'red'}>{statusLabel}</Status>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: true,
    meta: { className: 'w-40 text-center' },
  },

  // --- Hành động ---
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: { className: 'w-16 text-center' },
  },
]
