import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (time: string) => void
  initialTime?: string
  title?: string // thêm dòng này
}

export const TimePickerDialog: React.FC<Props> = ({ open, onClose, onConfirm, initialTime = '06:00', title }) => {
  const [hour, setHour] = useState(initialTime.split(':')[0] || '06')
  const [minute, setMinute] = useState(initialTime.split(':')[1] || '00')

  const handleConfirm = () => {
    const formatted = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    onConfirm(formatted)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-sm'>
        <DialogTitle>{title || 'Chọn giờ'}</DialogTitle>
        <DialogDescription>Chọn giờ và phút cho điểm dừng.</DialogDescription>
        <div className='flex flex-col items-center gap-4 p-4'>
          <div className='flex items-center gap-2 text-lg font-semibold'>
            <Clock className='h-5 w-5' />
            Chọn giờ
          </div>
          <div className='flex gap-3'>
            <select value={hour} onChange={(e) => setHour(e.target.value)} className='rounded border px-2 py-1'>
              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            :
            <select value={minute} onChange={(e) => setMinute(e.target.value)} className='rounded border px-2 py-1'>
              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
