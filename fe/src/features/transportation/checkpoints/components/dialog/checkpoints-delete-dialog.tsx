'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Checkpoint } from '../../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Checkpoint
}

export function CheckpointsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return onOpenChange(false)

    toast({
      title: 'Điểm dừng xe buýt đã bị xóa:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} /> Xóa điểm dừng
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa điểm dừng <span className='font-bold'>{currentRow.name}</span>?<br />
            Hành động này sẽ loại bỏ vĩnh viễn điểm dừng xe buýt này khỏi hệ thống. Không thể hoàn tác!
          </p>
          <Label className='my-2'>
            Nhập tên điểm dừng để xác nhận:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Nhập tên điểm dừng để xác nhận' />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>Hành động này không thể hoàn tác. Vui lòng cẩn thận.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Xóa'
      destructive
    />
  )
}
