// //path : fe/src/features/users/components/users-columns.tsx
// import { ColumnDef } from '@tanstack/react-table'
// import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
// import { Checkbox } from '@/components/ui/checkbox'
// import LongText from '@/components/common/long-text'
// import { callTypes, userTypes } from '../../data/data'
// import { User, UserStatus } from '../../data/schema'
// import { DataTableColumnHeader } from './data-table-column-header'
// import { DataTableRowActions } from './data-table-row-actions'
// // Tạo map tiếng Việt
// const statusLabels: Record<UserStatus, string> = {
//   ACTIVE: 'Đang hoạt động',
//   INACTIVE: 'Không hoạt động',
// }
// export const columns: ColumnDef<User>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' className='translate-y-[2px]' />,
//     meta: {
//       className: cn('sticky md:table-cell left-0 z-10 rounded-tl', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'),
//     },
//     cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' className='translate-y-[2px]' />,
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'username',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Tên tài khoản' />,
//     cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('username')}</LongText>,
//     meta: {
//       className: cn('drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted', 'sticky left-6 md:table-cell'),
//     },
//     enableHiding: false,
//   },
//   // {
//   //   id: 'fullName',
//   //   header: ({ column }) => (
//   //     <DataTableColumnHeader column={column} title='Name' />
//   //   ),
//   //   cell: ({ row }) => {
//   //     const { firstName, lastName } = row.original
//   //     const fullName = `${firstName} ${lastName}`
//   //     return <LongText className='max-w-36'>{fullName}</LongText>
//   //   },
//   //   meta: { className: 'w-36' },
//   // },
//   {
//     accessorKey: 'fullName',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Họ và tên' />,
//     cell: ({ row }) => {
//       // Lấy trực tiếp giá trị fullName từ row
//       const fullName = row.getValue('fullName') as string
//       return <LongText className='max-w-36'>{fullName}</LongText>
//     },
//     meta: {
//       className: 'w-36',
//     },
//   },
//   {
//     accessorKey: 'email',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
//     cell: ({ row }) => <div className='w-fit text-nowrap'>{row.getValue('email')}</div>,
//   },
//   {
//     accessorKey: 'phoneNumber',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
//     cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
//     enableSorting: false,
//   },
//   {
//     accessorKey: 'status',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái TK' />,
//     cell: ({ row }) => {
//       const { status } = row.original
//       const badgeColor = callTypes.get(status)
//       return (
//         <div className='flex space-x-2'>
//           <Badge variant='outline' className={cn('capitalize', badgeColor)}>
//             {row.getValue('status')}
//           </Badge>
//         </div>
//       )
//     },
//     filterFn: (row, id, value) => {
//       return value.includes(row.getValue(id))
//     },
//     enableHiding: false,
//     enableSorting: false,
//   },
//   {
//     accessorKey: 'role',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
//     cell: ({ row }) => {
//       const { role } = row.original
//       const userType = userTypes.find(({ value }) => value === role)
//       if (!userType) {
//         return null
//       }
//       return (
//         <div className='flex items-center gap-x-2'>
//           {userType.icon && <userType.icon size={16} className='text-muted-foreground' />}
//           <span className='text-sm capitalize'>{userType.labelVi}</span>
//         </div>
//       )
//     },
//     filterFn: (row, id, value) => {
//       return value.includes(row.getValue(id))
//     },
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     id: 'actions',
//     cell: DataTableRowActions,
//   },
// ]
// fe/src/features/users/components/users-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/common/long-text'
import { callTypes, userTypes } from '../../data/data'
import { User, UserStatus } from '../../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// 1) Map tiếng Việt cho status (nếu cần)
const statusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
}

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

  // -- CỘT TÀI KHOẢN --
  // {
  //   accessorKey: 'username',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Tài khoản' />,
  //   cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('username')}</LongText>,
  //   meta: {
  //     className: cn('drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none', 'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted', 'sticky left-6 md:table-cell'),
  //   },
  //   enableHiding: true,
  // },

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
      // Lấy CSS class dành cho badge (màu sắc) trong callTypes
      const badgeColor = callTypes.get(status) // callTypes map => "ACTIVE" => 'bg-teal-100...'
      // Lấy nhãn tiếng Việt từ statusLabels
      const statusLabel = statusLabels[status] || status // fallback
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

  // -- CỘT VAI TRÒ --
  // {
  //   accessorKey: 'role',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
  //   cell: ({ row }) => {
  //     const { role } = row.original
  //     // Tìm object mô tả role trong userTypes (vd: { labelVi: 'Giáo viên', value: 'TEACHER' })
  //     const userType = userTypes.find((item) => item.value === role)
  //     if (!userType) {
  //       return <span className='text-sm'>N/A</span>
  //     }
  //     return (
  //       <div className='flex items-center gap-x-2'>
  //         {/* Hiển thị icon nếu có */}
  //         {userType.icon && <userType.icon size={16} className='text-muted-foreground' />}
  //         {/* labelVi = 'Giáo viên', 'Phụ huynh', v.v. */}
  //         <span className='text-sm'>{userType.labelVi}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    // Định nghĩa cột "role"
    // Lấy vai trò đầu tiên từ mảng roles
    id: 'role',
    accessorFn: (row) => row.roles[0] ?? 'N/A', // fallback nếu array rỗng
    header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
    cell: ({ getValue }) => {
      const singleRole = getValue() as string // ví dụ "TEACHER" / "ADMIN"

      if (!singleRole || singleRole === 'N/A') {
        return <span className='text-sm'>N/A</span>
      }

      // Tìm userType tương ứng
      const userType = userTypes.find((t) => t.value === singleRole)
      if (!userType) {
        return <span className='text-sm'>{singleRole}</span>
      }

      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && <userType.icon size={16} className='text-muted-foreground' />}
          <span className='text-sm'>{userType.labelVi}</span>
        </div>
      )
    },
    // Cho phép filter
    filterFn: (row, id, filterValues) => {
      // filterValues là một array do FacetedFilter cung cấp
      // Bên trong row, getValue(id) sẽ trả về singleRole
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
