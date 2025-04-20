import React, { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableStudentToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableStudentToolbar<TData>({ table }: DataTableStudentToolbarProps<TData>) {
  const [searchField, setSearchField] = useState<'name' | 'parentName' | 'parentPhone'>('name')

  const searchPlaceholder: Record<typeof searchField, string> = {
    name: 'Tìm kiếm theo tên học sinh...',
    parentName: 'Tìm kiếm theo tên phụ huynh...',
    parentPhone: 'Tìm kiếm theo SĐT phụ huynh...',
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ;(['name', 'parentName', 'parentPhone'] as const).forEach((field) => {
      if (field !== searchField) {
        table.getColumn(field)?.setFilterValue('')
      }
    })
    table.getColumn(searchField)?.setFilterValue(event.target.value)
  }

  const isFiltered = table.getState().columnFilters.some((filter) => ['name', 'parentName', 'parentPhone'].includes(filter.id as string))

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-4'>
        <Select value={searchField} onValueChange={(value) => setSearchField(value as 'name' | 'parentName' | 'parentPhone')}>
          <SelectTrigger className='h-9 w-[150px]'>
            <SelectValue placeholder='Chọn trường tìm kiếm' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Tên học sinh</SelectItem>
            <SelectItem value='parentName'>Tên phụ huynh</SelectItem>
            <SelectItem value='parentPhone'>SĐT phụ huynh</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder={searchPlaceholder[searchField]} value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ''} onChange={handleSearchChange} className='h-9 w-[200px] lg:w-[250px]' />

        <div className='flex gap-x-2'>
          {table.getColumn('gender') && (
            <DataTableFacetedFilter
              column={table.getColumn('gender')}
              title='Giới tính'
              options={[
                { label: 'Nam', value: 'MALE' },
                { label: 'Nữ', value: 'FEMALE' },
              ]}
            />
          )}

          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Trạng thái'
              options={[
                { label: 'Đang sử dụng', value: 'ACTIVE' },
                { label: 'Không sử dụng', value: 'INACTIVE' },
              ]}
            />
          )}
        </div>

        {isFiltered && (
          <Button
            variant='outline'
            onClick={() => {
              ;(['name', 'parentName', 'parentPhone'] as const).forEach((field) => {
                table.getColumn(field)?.setFilterValue('')
              })
            }}
            className='h-9 px-3'
          >
            Reset <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
