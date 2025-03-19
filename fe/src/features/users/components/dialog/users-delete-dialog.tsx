'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { User } from '../../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User | null // Cho phép currentRow là null
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (!currentRow || value.trim() !== currentRow.name) {
      onOpenChange(false)
      return
    }

    toast({
      title: 'Người dùng sau đã bị xóa:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
        </pre>
      ),
    })

    onOpenChange(false) // Đóng hộp thoại sau khi xóa
  }

  // Nếu currentRow không được cung cấp, không hiển thị nội dung hộp thoại
  if (!currentRow) {
    return null
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
          Xóa Người Dùng
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa <span className='font-bold'>{currentRow.name}</span>?<br />
            Hành động này sẽ xóa vĩnh viễn người dùng có vai trò <span className='font-bold'>{currentRow.role?.toUpperCase() || 'KHÔNG XÁC ĐỊNH'}</span> khỏi hệ thống.
            <br /> Hành động này không thể hoàn tác.
          </p>
          <Label className='my-2'>
            Tên:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Nhập tên để xác nhận xóa.' />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>Hãy cẩn thận, thao tác này không thể khôi phục.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Xóa'
      destructive
    />
  )
}
