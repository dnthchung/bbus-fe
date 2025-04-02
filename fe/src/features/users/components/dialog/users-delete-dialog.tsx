'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
// ✅ Gọi API xoá người dùng
import { useUsers } from '../../context/users-context'
import { userTypes } from '../../data'
import { User } from '../../schema'

// ✅ Gọi context để refresh user list

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User | null // Cho phép currentRow là null
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false) // ✅ Loading state
  const { refreshUsers } = useUsers() // ✅ Lấy từ context

  const handleDelete = async () => {
    if (!currentRow || value.trim() !== currentRow.name) {
      onOpenChange(false)
      return
    }

    try {
      setIsDeleting(true)
      console.log('Deleting user with ID:', currentRow.userId)
      // ✅ Gọi API xóa người dùng
      await API_SERVICES.users.deleteOne(currentRow.userId)

      // ✅ Gọi toast thông báo
      toast({
        title: 'Đã xóa người dùng thành công',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
          </pre>
        ),
      })

      // ✅ Refresh danh sách user sau khi xóa
      await refreshUsers()

      // ✅ Đóng hộp thoại sau khi xóa
      onOpenChange(false)
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
      toast({
        title: 'Không thể xóa người dùng',
        description: 'Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Nếu currentRow không được cung cấp, không hiển thị nội dung hộp thoại
  if (!currentRow) {
    return null
  }

  // Tìm vai trò tiếng Việt từ userTypes dựa trên currentRow.role
  const roleLabelVi = userTypes.find((type) => type.value === currentRow.role)?.labelVi || 'KHÔNG XÁC ĐỊNH'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isDeleting}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} />
          Xóa Người Dùng
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa <span className='font-bold'>{currentRow.name}</span>?<br />
            Hành động này sẽ xóa vĩnh viễn người dùng có vai trò <span className='font-bold'>{roleLabelVi.toUpperCase()}</span> khỏi hệ thống. <br />
            Hành động này không thể hoàn tác.
          </p>

          <Label className='my-2'>
            <p className='mb-2 mt-5'>
              Nhập <span className='rounded bg-yellow-200 px-1 font-bold'>"{currentRow.name}"</span> để xác nhận xóa
            </p>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='abc' />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>Hãy cẩn thận, thao tác này không thể khôi phục.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Đang xóa...' : 'Xóa'}
      destructive
    />
  )
}
