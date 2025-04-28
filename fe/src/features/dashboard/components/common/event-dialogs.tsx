// src/features/dashboard/components/event-dialogs.tsx
import { useState } from 'react'
import { API_SERVICES } from '@/api/api-services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type EventDialogProps = {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  title: string
  submitLabel: string
  defaultValues?: {
    name: string
    start: string
    end: string
  }
}

export function EventDialog({ open, onClose, mode, title, submitLabel, defaultValues }: EventDialogProps) {
  const { toast } = useToast()
  const [name, setName] = useState(defaultValues?.name || '')
  const [start, setStart] = useState(defaultValues?.start || '')
  const [end, setEnd] = useState(defaultValues?.end || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !start || !end) {
      toast({ variant: 'destructive', title: 'Vui lòng điền đầy đủ thông tin' })
      return
    }
    try {
      setLoading(true)
      if (mode === 'create') {
        await API_SERVICES.event.create_event({ name, start, end })
      } else {
        await API_SERVICES.event.update_event({ name, startDate: start, endDate: end })
      }

      toast({ title: 'Thành công', description: 'Đã cập nhật thông tin' })
      onClose()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Đã xảy ra lỗi, thử lại sau' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Input placeholder='Tên' value={name} onChange={(e) => setName(e.target.value)} />
          <Input type='date' value={start} onChange={(e) => setStart(e.target.value)} />
          <Input type='date' value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
