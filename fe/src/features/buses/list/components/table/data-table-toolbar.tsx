// fe/src/features/buses/components/data-table-toolbar.tsx
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
        {/* Tìm kiếm theo tên xe buýt */}
        <Input placeholder='Tìm kiếm theo tên xe...' value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        <div className='flex gap-x-2'>
          {/* Bạn có thể thêm filter nếu muốn lọc theo tuyến hoặc tài xế */}
          {/* Ví dụ nếu muốn lọc theo route: */}
          {/*
          {table.getColumn('route') && (
            <DataTableFacetedFilter
              column={table.getColumn('route')}
              title='Tuyến đường'
              options={[
                { label: 'Hà Nội - Hải Phòng', value: 'Route Hà Nội - Hải Phòng' },
                { label: 'Đà Nẵng - Huế', value: 'Route Đà Nẵng - Huế' },
              ]}
            />
          )}
          */}
        </div>

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Xoá lọc
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
