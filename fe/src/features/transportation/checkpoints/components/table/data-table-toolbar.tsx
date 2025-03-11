import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Ô tìm kiếm theo tên điểm dừng */}
        <Input placeholder='Tìm kiếm theo tên điểm dừng...' value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        {/* Bộ lọc trạng thái điểm dừng */}
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Trạng thái điểm dừng'
              options={[
                { label: 'Đang hoạt động', value: 'ACTIVE' },
                { label: 'Ngừng hoạt động', value: 'INACTIVE' },
              ]}
            />
          )}
        </div>

        {/* Nút Reset bộ lọc nếu có lọc dữ liệu */}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Hoàn tác <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Tùy chỉnh hiển thị cột */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
