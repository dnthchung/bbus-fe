// fe/src/features/users/components/data-table-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userTypes, allUsersExceptAdminsTypes , allAdminUsersTypes } from '@/features/users/data'
import { DataTableFacetedFilter } from '@/features/users/components/table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/features/users/components/table/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const userRole = localStorage.getItem('role')
    const getRoleOptions = () => {
      if (userRole === 'ADMIN') {
        return allUsersExceptAdminsTypes;
      } else if (userRole === 'SYSADMIN') {
        return allAdminUsersTypes;
      } else {
        return userTypes;
      }
    }
  
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input placeholder='Tìm kiếm theo tên...' value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Trạng thái TK'
              options={[
                { label: 'Đang hoạt động', value: 'ACTIVE' },
                { label: 'Ngừng hoạt động', value: 'INACTIVE' },
              ]}
            />
          )}

          {/* Filter cho cột 'role' */}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Vai trò'
              options={getRoleOptions().map((t) => ({
                label: t.labelVi, // hiển thị cho người dùng
                value: t.value, // TEACHER, ADMIN, ...
              }))}
            />
          )}
        </div>

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
