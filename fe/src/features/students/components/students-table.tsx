// Đường dẫn: fe/src/features/users/components/users-table.tsx
import { useState } from 'react'
import { ColumnDef, ColumnFiltersState, RowData, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Student } from '../data/schema'
import { DataTablePagination } from './table/data-table-pagination'
import { DataTableStudentToolbar } from './table/data-table-toolbar'

// Mở rộng module '@tanstack/react-table' để thêm thuộc tính `className` cho `ColumnMeta`
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

// Định nghĩa interface cho `UsersTable`
interface DataTableProps {
  columns: ColumnDef<Student>[] // Mảng các cột của bảng
  data: Student[] // Dữ liệu hiển thị trong bảng
}

// Component chính: UsersTable
export function StudentsTable({ columns, data }: DataTableProps) {
  // State quản lý các trạng thái của bảng
  const [rowSelection, setRowSelection] = useState({}) // Trạng thái chọn dòng
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // Trạng thái hiển thị cột
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // Trạng thái bộ lọc
  const [sorting, setSorting] = useState<SortingState>([]) // Trạng thái sắp xếp

  // Sử dụng `useReactTable` để tạo bảng với các tính năng được cấu hình
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true, // Cho phép chọn dòng
    onRowSelectionChange: setRowSelection, // Cập nhật trạng thái khi chọn dòng
    onSortingChange: setSorting, // Cập nhật trạng thái khi sắp xếp
    onColumnFiltersChange: setColumnFilters, // Cập nhật trạng thái bộ lọc
    onColumnVisibilityChange: setColumnVisibility, // Cập nhật trạng thái hiển thị cột
    getCoreRowModel: getCoreRowModel(), // Lấy dữ liệu cốt lõi của bảng
    getFilteredRowModel: getFilteredRowModel(), // Lấy dữ liệu sau khi lọc
    getPaginationRowModel: getPaginationRowModel(), // Lấy dữ liệu phân trang
    getSortedRowModel: getSortedRowModel(), // Lấy dữ liệu đã sắp xếp
    getFacetedRowModel: getFacetedRowModel(), // Lấy dữ liệu với bộ lọc theo nhóm
    getFacetedUniqueValues: getFacetedUniqueValues(), // Lấy các giá trị duy nhất cho bộ lọc
  })

  return (
    <div className='space-y-4'>
      {/* Thanh công cụ của bảng */}
      <DataTableStudentToolbar table={table} />

      {/* Bảng dữ liệu */}
      <div className='rounded-md border'>
        <Table>
          {/* Phần tiêu đề bảng */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className={header.column.columnDef.meta?.className ?? ''}>
                      {/* Hiển thị tiêu đề cột, sử dụng flexRender để render dữ liệu */}
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Phần thân bảng */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              // Duyệt qua danh sách hàng và hiển thị dữ liệu
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='group/row'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className ?? ''}>
                      {/* Render nội dung của ô */}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Hiển thị thông báo nếu không có dữ liệu
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Thành phần phân trang */}
      <DataTablePagination table={table} />
    </div>
  )
}
