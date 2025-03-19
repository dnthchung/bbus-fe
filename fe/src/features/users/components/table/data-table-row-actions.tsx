import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { API_SERVICES } from '@/api/api-services'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUsers } from '../../context/users-context'
import { User } from '../../data/schema'

// Import API_SERVICES

interface DataTableRowActionsProps {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const [loading, setLoading] = useState(false)
  // Hàm xử lý khi nhấn "Xem chi tiết"
  const handleViewDetails = async () => {
    try {
      // Gọi API để lấy chi tiết user dựa trên userId
      const response = await API_SERVICES.users.getOne(row.original.userId)
      const userDetails = response.data // Giả sử response.data chứa thông tin chi tiết user
      console.log('User details:', userDetails?.data) // Kiểm tra dữ liệu nhận được từ API
      setCurrentRow(userDetails?.data) // Cập nhật currentRow với dữ liệu từ API
      setOpen('view-edit-details') // Mở dialog xem chi tiết
    } catch (error) {
      console.error('Failed to fetch user details:', error)
      // Có thể hiển thị thông báo lỗi nếu cần
    } finally {
      setLoading(false) // Đặt loading về false sau khi hoàn thành
    }
  }

  return (
    <>
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
    </>
  )
}
