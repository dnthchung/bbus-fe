'use client'

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
    if (value.trim() !== currentRow.fullName) return onOpenChange(false)

    toast({
      title: 'The following student has been deleted:',
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
      disabled={value.trim() !== currentRow.fullName}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} />
          Delete Student
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete <span className='font-bold'>{currentRow.fullName}</span>? <br />
            This action will permanently remove the student from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Full Name:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Enter full name to confirm deletion.' />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>Please be careful, this operation cannot be undone.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
