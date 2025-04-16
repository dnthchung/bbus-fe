// Đường dẫn: d:\Workspace\Github_folder\bbus-fe\fe\src\features\transportation\routes\list\index.tsx
import { useState } from 'react'
import { ColumnDef, ColumnFiltersState, RowData, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination } from '@/features/transportation/routes/components/table/data-table-pagination'
import { DataTableToolbar } from '@/features/transportation/routes/components/table/data-table-toolbar'
import { Route } from '@/features/transportation/schema'

// Mở rộng module '@tanstack/react-table' để thêm thuộc tính `className` cho `ColumnMeta`
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

// Định nghĩa interface cho `RoutesTable`
interface DataTableProps {
  columns: ColumnDef<Route>[] // Mảng các cột của bảng
  data: Route[] // Dữ liệu hiển thị trong bảng
  onRowClick?: (route: Route) => void // Callback khi click vào hàng
  highlightedRowId?: string | null // ID của hàng được highlight
  hideCheckboxes?: boolean // Tùy chọn ẩn checkbox
  className?: string // Class bổ sung cho container
}

// Component chính: RoutesTable
export function RoutesTable({ columns, data, onRowClick, highlightedRowId, hideCheckboxes = false, className = '' }: DataTableProps) {
  // State quản lý các trạng thái của bảng
  const [rowSelection, setRowSelection] = useState({}) // Trạng thái chọn dòng
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...(hideCheckboxes ? { select: false } : {}),
  }) // Trạng thái hiển thị cột
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
    enableRowSelection: !hideCheckboxes, // Chỉ cho phép chọn dòng khi không ẩn checkbox
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
    <div className={`space-y-4 ${className}`}>
      {/* Thanh công cụ của bảng */}
      <DataTableToolbar table={table} />

      {/* Bảng dữ liệu */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className={header.column.columnDef.meta?.className ?? ''}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className={`group/row ${highlightedRowId === row.original.id ? 'bg-muted' : ''}`} onClick={() => onRowClick && onRowClick(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className ?? ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
