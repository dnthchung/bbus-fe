// //path : fe/src/features/students/components/table/data-table-column-header.tsx
// import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
// import { MixerHorizontalIcon } from '@radix-ui/react-icons'
// import { Table } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
// interface DataTableViewOptionsProps<TData> {
//   table: Table<TData>
// }
// export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger asChild>
//         <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
//           <MixerHorizontalIcon className='mr-2 h-4 w-4' /> Hiển thị
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align='end' className='w-[150px]'>
//         <DropdownMenuLabel>Bật/tắt cột</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {table
//           .getAllColumns()
//           .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
//           .map((column) => {
//             return (
//               <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
//                 {column.id}
//               </DropdownMenuCheckboxItem>
//             )
//           })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

// Define a map of column IDs to Vietnamese column names
const columnNameMap: Record<string, string> = {
  avatar: 'Hình ảnh',
  name: 'Họ và tên',
  dob: 'Ngày sinh',
  gender: 'Giới tính',
  status: 'Trạng thái',
  address: 'Địa chỉ',
  parentName: 'Tên phụ huynh',
  parentPhone: 'SĐT phụ huynh',
  // Add other column mappings as needed
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
          <MixerHorizontalIcon className='mr-2 h-4 w-4' />
          Hiển thị
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuLabel>Bật/tắt cột</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            const columnDisplayName = columnNameMap[column.id] || column.id

            return (
              <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                {columnDisplayName}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
