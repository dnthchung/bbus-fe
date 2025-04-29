import { useState, useEffect } from 'react'
import { API_SERVICES } from '@/api/api-services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/mine/badge'

export const registeredEvent = {
  id: '6844bb7d-2825-46c4-a295-72b6232e161b',
  createdAt: '2025-04-24T17:07:51.876+00:00',
  updatedAt: '2025-04-28T07:50:45.175+00:00',
  name: 'Mở ngày đăng ký điểm đón',
  start: '2025-04-28T14:44:00.000+00:00',
  end: '2025-04-29T01:10:10.000+00:00',
}

type EventDialogProps = {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  title: string
  submitLabel: string
  defaultValues?: {
    start: string
    end: string
  }
}

// School year constants
const SCHOOL_YEAR = {
  start: new Date('2024-09-01T00:00:00Z'),
  end: new Date('2025-06-01T00:00:00Z'),
}

// Minimum and maximum event duration in hours
const MIN_EVENT_DURATION = 5 // Changed from 1 hour to 5 hours
const MAX_EVENT_DURATION = 30 * 24 // 30 days

// Fixed event name
const FIXED_EVENT_NAME = 'Mở ngày đăng ký điểm đón'

export function EventDialog({ open, onClose, mode, title, submitLabel, defaultValues }: EventDialogProps) {
  const { toast } = useToast()

  // Form state
  const [formState, setFormState] = useState({
    start: '',
    end: '',
  })
  const [loading, setLoading] = useState(false)

  // Initialize form with default values when dialog opens or defaultValues change
  useEffect(() => {
    if (defaultValues) {
      setFormState({
        start: defaultValues.start ? new Date(defaultValues.start).toISOString().slice(0, 16) : '',
        end: defaultValues.end ? new Date(defaultValues.end).toISOString().slice(0, 16) : '',
      })
    } else {
      setFormState({
        start: '',
        end: '',
      })
    }
  }, [open, defaultValues])

  const handleInputChange = (field: keyof typeof formState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [field]: e.target.value,
    })
  }

  const validateInputs = () => {
    const { start, end } = formState

    // Rule 1: Required fields - name is fixed so we only check dates
    if (!start || !end) {
      toast({
        variant: 'deny',
        title: 'Vui lòng điền đầy đủ thông tin',
      })
      return false
    }

    // Rule 2 & 3: Valid date formats and values
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast({
        variant: 'deny',
        title: 'Thời gian không hợp lệ',
      })
      return false
    }

    // Rule 4: End time must be after start time
    if (endDate <= startDate) {
      toast({
        variant: 'deny',
        title: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      })
      return false
    }

    // Rule 5: Must be within school year
    if (startDate < SCHOOL_YEAR.start || endDate > SCHOOL_YEAR.end) {
      toast({
        variant: 'deny',
        title: `Thời gian phải nằm trong năm học (${SCHOOL_YEAR.start.toISOString().slice(0, 10)} đến ${SCHOOL_YEAR.end.toISOString().slice(0, 10)})`,
      })
      return false
    }

    // Rule 6: End time must be at least 5 hours in the future from current time
    const now = new Date()
    const minimumEndTime = new Date(now.getTime() + 5 * 60 * 60 * 1000) // now + 5 hours
    if (endDate <= minimumEndTime) {
      toast({
        variant: 'deny',
        title: 'Thời gian kết thúc phải cách thời điểm hiện tại ít nhất 5 giờ',
        description: `Thời gian kết thúc tối thiểu là ${minimumEndTime.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`,
      })
      return false
    }

    // Rule 7: Start and end must be at least 5 hours apart
    const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    if (diffHours < MIN_EVENT_DURATION) {
      toast({
        variant: 'deny',
        title: 'Thời gian bắt đầu và kết thúc phải cách nhau ít nhất 5 giờ',
      })
      return false
    }

    // Rule 8: Maximum event duration
    if (diffHours > MAX_EVENT_DURATION) {
      toast({
        variant: 'deny',
        title: `Khoảng thời gian mở đơn không được vượt quá ${MAX_EVENT_DURATION / 24} ngày`,
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateInputs()) return

    try {
      setLoading(true)

      // Format dates to ISO 8601
      const formattedStart = new Date(formState.start).toISOString()
      const formattedEnd = new Date(formState.end).toISOString()

      if (mode === 'create') {
        console.log('Creating new event with data:')
        // await API_SERVICES.event.create_event({
        //   name: FIXED_EVENT_NAME,
        //   start: formattedStart,
        //   end: formattedEnd,
        // })
      } else {
        console.log('Updating event with data:')
        // await API_SERVICES.event.update_event({
        //   name: FIXED_EVENT_NAME,
        //   start: formattedStart,
        //   end: formattedEnd,
        // })
      }

      toast({
        title: 'Thành công',
        description: mode === 'create' ? 'Đã tạo sự kiện mới' : 'Đã cập nhật thông tin',
      })
      onClose()
    } catch (error) {
      toast({
        variant: 'deny',
        title: 'Đã xảy ra lỗi',
        description: 'Vui lòng thử lại sau',
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function for formatting dates
  const formatDate = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='event-name'>Tên sự kiện</Label>
            <div className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground'>{FIXED_EVENT_NAME}</div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='event-start'>Thời gian bắt đầu</Label>
            <Input id='event-start' type='datetime-local' value={formState.start} onChange={handleInputChange('start')} />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='event-end'>Thời gian kết thúc</Label>
            <Input id='event-end' type='datetime-local' value={formState.end} onChange={handleInputChange('end')} />
          </div>

          {mode === 'edit' && registeredEvent && (
            <div className='mt-4'>
              <h3 className='mb-2 text-sm font-medium'>Thông tin sự kiện</h3>
              <div className='w-full rounded border border-gray-100 dark:border-gray-600'>
                <table className='w-full table-fixed text-sm'>
                  <tbody>
                    <InfoRow label='Tên sự kiện' value={FIXED_EVENT_NAME} />
                    <InfoRow label='Bắt đầu' value={formatDate(registeredEvent.start)} />
                    <InfoRow label='Kết thúc' value={formatDate(registeredEvent.end)} />
                    <InfoRow label='Ngày tạo' value={formatDate(registeredEvent.createdAt)} />
                    <InfoRow label='Cập nhật cuối' value={formatDate(registeredEvent.updatedAt)} />
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang xử lý...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* -------- Row helper component -------- */
function InfoRow({ label, value, multiline = false }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <tr className='border-t border-gray-300 dark:border-gray-600'>
      <td className='w-1/3 bg-gray-100 p-2 align-top text-sm font-medium dark:bg-gray-800'>{label}:</td>
      <td className={`p-2 text-sm ${multiline ? 'whitespace-pre-wrap break-words' : ''}`}>
        {value || (
          <Badge variant='soft' color='yellow'>
            Trống
          </Badge>
        )}
      </td>
    </tr>
  )
}
