// path : fe/src/features/students/components/data-table-student-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

/**
 * Props for DataTableStudentToolbar:
 * @table - The table instance from @tanstack/react-table
 */
interface DataTableStudentToolbarProps<TData> {
  table: Table<TData>
}

/**
 * A toolbar to filter/search by columns: name, gender, status
 */
export function DataTableStudentToolbar<TData>({ table }: DataTableStudentToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      {/* Left side: search input & filters */}
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search by name */}
        <Input placeholder='Tìm kiếm tên...' value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        <div className='flex gap-x-2'>
          {/* Filter by gender: MALE, FEMALE, OTHER */}
          {table.getColumn('gender') && (
            <DataTableFacetedFilter
              column={table.getColumn('gender')}
              title='Giới tính'
              options={[
                { label: 'Nam', value: 'MALE' },
                { label: 'Nữ', value: 'FEMALE' },
                { label: 'Khác', value: 'OTHER' },
              ]}
            />
          )}

          {/* Filter by status: ACTIVE, INACTIVE */}
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Trạng thái'
              options={[
                { label: 'Đang hoạt động', value: 'ACTIVE' },
                { label: 'Không hoạt động', value: 'INACTIVE' },
              ]}
            />
          )}
        </div>

        {/* Reset filters button (only show if any filter is active) */}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Right side: view options (toggles for showing/hiding columns, etc.) */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
