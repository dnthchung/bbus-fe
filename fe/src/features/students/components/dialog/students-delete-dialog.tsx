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
  // We want user to type in the student's name to confirm
  // because "fullName" -> "name" in the new schema
  const [value, setValue] = useState('')

  const handleDelete = () => {
    // Only delete if user typed exactly the student's name
    if (value.trim() !== currentRow.name) {
      return onOpenChange(false)
    }

    // Do your delete logic here, e.g. call API...
    toast({
      title: 'Học sinh đã bị xóa:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
        </pre>
      ),
    })

    // Close the dialog
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      // Disable "Delete" button unless typed name matches
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
            Bạn có chắc muốn xóa <span className='font-bold'>{currentRow.name}</span>?
            <br />
            Hành động này sẽ xóa vĩnh viễn học sinh khỏi hệ thống và không thể hoàn tác.
          </p>
          <Label className='my-2'>
            Nhập chính xác tên học sinh để xác nhận:
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
