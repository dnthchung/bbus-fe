'use client'

// path: fe/src/features/students/components/dialog/students-delete-dialog.tsx
import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Student } from '../../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Student
}

export function StudentsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) {
      onOpenChange(false)
      return
    }

    // Gọi API hoặc thực hiện xóa tại đây...
    toast({
      title: 'Học sinh đã bị xóa:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
        </pre>
      ),
    })

    onOpenChange(false) // Đóng hộp thoại sau khi xóa
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
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
      confirmText='Xóa'
      destructive
    />
  )
}
