// fe/src/features/buses/list/components/table/data-table-toolbar.tsx
import { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { statusLabels } from '@/features/buses/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const SEARCH_FIELDS = [
  { label: 'Biển số xe', value: 'licensePlate' },
  { label: 'Tên xe', value: 'name' },
  { label: 'SĐT tài xế', value: 'driverPhone' },
  { label: 'SĐT phụ xe', value: 'assistantPhone' },
]

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const [selectedField, setSelectedField] = useState('name')
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    table.getColumn(selectedField)?.setFilterValue(value)
  }

  const handleFieldChange = (field: string) => {
    const prevValue = table.getColumn(selectedField)?.getFilterValue() ?? ''
    table.getColumn(selectedField)?.setFilterValue('') // clear old
    setSelectedField(field)
    setSearchValue(prevValue as string) // optional: reset or preserve value
    table.getColumn(field)?.setFilterValue(prevValue) // move to new field
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Dropdown + Search input */}
        <div className='flex gap-2'>
          <Select value={selectedField} onValueChange={handleFieldChange}>
            <SelectTrigger className='h-8 w-[140px]'>
              <SelectValue placeholder='Tìm theo...' />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_FIELDS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder={`Tìm kiếm theo ${SEARCH_FIELDS.find((f) => f.value === selectedField)?.label.toLowerCase()}...`} value={searchValue} onChange={(e) => handleSearchChange(e.target.value)} className='h-8 w-[220px] lg:w-[260px]' />
        </div>

        {/* Filter trạng thái */}
        <div className='flex gap-x-2'>
          {table.getColumn('busStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('busStatus')}
              title='Trạng thái'
              options={[
                { label: statusLabels.ACTIVE, value: 'ACTIVE' },
                { label: statusLabels.INACTIVE, value: 'INACTIVE' },
              ]}
            />
          )}
        </div>

        {/* Nút xoá bộ lọc */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              setSearchValue('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Xóa bộ lọc
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
