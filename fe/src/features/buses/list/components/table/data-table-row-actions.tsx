//path : fe/src/features/buses/list/components/table/data-table-row-actions.tsx
import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useBuses } from '@/features/buses/context/buses-context'
import { Bus } from '@/features/buses/data/schema'

// Nếu sau này có API gọi chi tiết bus, import tại đây
// import { API_SERVICES } from '@/api/api-services'

interface DataTableRowActionsProps {
  row: Row<Bus>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useBuses()
  const [loading, setLoading] = useState(false)

  // Nếu bạn có API để fetch chi tiết từng bus theo ID, bạn có thể bật lại đoạn này
  const handleViewDetails = async () => {
    try {
      setLoading(true)

      // Nếu cần fetch chi tiết từ server:
      // const response = await API_SERVICES.buses.getOne(row.original.id)
      // const busDetails = response.data?.data
      // setCurrentRow(busDetails)

      // Tạm thời dùng luôn dữ liệu row
      setCurrentRow(row.original)
      setOpen('view-edit-details')
    } catch (error) {
      console.error('Failed to fetch bus details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Mở menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-[160px]'>
        {/* ===== Xem chi tiết ===== */}
        <DropdownMenuItem onClick={handleViewDetails}>
          Xem chi tiết
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* ===== Xóa ===== */}
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='!text-red-500'
        >
          Xóa
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
