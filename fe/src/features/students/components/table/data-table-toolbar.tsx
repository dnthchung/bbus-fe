//path : fe/src/features/users/components/data-table-toolbar.tsx
// fe/src/features/students/components/data-table-student-toolbar.tsx
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

/**
 * The props for DataTableStudentToolbar:
 * @table - The table instance from @tanstack/react-table
 */
interface DataTableStudentToolbarProps<TData> {
  table: Table<TData>
}

/**
 * A toolbar to filter/search by columns: fullName, grade, class, busServiceStatus
 */
export function DataTableStudentToolbar<TData>({ table }: DataTableStudentToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      {/* Left side: search input & filters */}
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search by fullName */}
        <Input placeholder='Tìm kiếm tên...' value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('fullName')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        {/* Faceted filters */}
        <div className='flex gap-x-2'>
          {/* Filter by grade (1 -> 9) */}
          {table.getColumn('grade') && (
            <DataTableFacetedFilter
              column={table.getColumn('grade')}
              title='Khối'
              options={Array.from({ length: 9 }, (_, i) => {
                const val = i + 1
                return { label: `Khối ${val}`, value: val.toString() }
              })}
            />
          )}

          {/* Filter by class, e.g. "1A", "1B", "2C" ... */}
          {table.getColumn('class') && (
            <DataTableFacetedFilter
              column={table.getColumn('class')}
              title='Lớp'
              // Hardcode or dynamically generate a list of classes here
              // For demo, let's just show all combos from 1..9 with A..J
              options={Array.from({ length: 9 }, (_, i) => i + 1).flatMap((g) =>
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((suffix) => {
                  const cls = `${g}${suffix}`
                  return { label: cls, value: cls }
                })
              )}
            />
          )}

          {/* Filter by busServiceStatus: "Đang sử dụng" / "Tạm ngừng sử dụng" */}
          {table.getColumn('busServiceStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('busServiceStatus')}
              title='Trạng thái'
              options={[
                { label: 'Đang sử dụng', value: 'Đang sử dụng' },
                { label: 'Tạm ngừng sử dụng', value: 'Tạm ngừng sử dụng' },
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
