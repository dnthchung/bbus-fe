// fe/src/features/buses/list/components/table/data-table-row-actions.tsx
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Bus } from '@/features/buses/data/schema'

interface DataTableRowActionsProps {
  row: Row<Bus>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate({ to: `/buses/list/${row.original.id}` })
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
            // Xử lý xóa xe buýt tại đây
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
