'use client'

// path: fe/src/features/students/components/dialog/students-delete-dialog.tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { useStudents } from '../../context/students-context'
import { Student } from '../../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Student
  onSuccess?: () => void
}

export function StudentsDeleteDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const { refreshStudents } = useStudents()

  console.log('Deleting student with ID:', currentRow.id)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) {
      onOpenChange(false)
      return
    }

    setIsDeleting(true)

    try {
      // Gọi API xóa học sinh
      console.log('Deleting student with ID:', currentRow.id)
      await API_SERVICES.students.deleteOne(currentRow.id)

      // Cập nhật danh sách học sinh sau khi xóa thành công
      await refreshStudents()

      toast({
        title: 'Thành công',
        description: `Đã xóa học sinh ${currentRow.name} khỏi hệ thống.`,
      })

      // Đóng hộp thoại sau khi xóa
      onOpenChange(false)

      // Gọi callback onSuccess nếu được cung cấp
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa học sinh. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isDeleting}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} />
          Xóa học sinh
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc muốn xóa <span className='font-bold'>{currentRow.name}</span>? <br />
            Hành động này sẽ xóa vĩnh viễn học sinh khỏi hệ thống và không thể hoàn tác.
          </p>

          <Label className='my-2'>
            <p className='mb-2 mt-5'>
              Nhập <span className='rounded bg-yellow-200 px-1 font-bold'>"{currentRow.name}"</span> để xác nhận xóa:
            </p>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Nhập lại tên học sinh...' />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>Thao tác này sẽ không thể hoàn tác, vui lòng cẩn thận.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Đang xóa...' : 'Xóa'}
      destructive
    />
  )
}
