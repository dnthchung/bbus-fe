import { useState, useEffect, useMemo } from 'react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { API_SERVICES } from '@/api/api-services'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/mine/badge'

/* -------------------- Kiểu props -------------------- */
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

/* -------------------- Hằng số -------------------- */
const SCHOOL_YEAR = {
  start: new Date('2024-09-01T00:00:00Z'),
  end: new Date('2025-06-01T00:00:00Z'),
}
const MIN_EVENT_DURATION = 5 // giờ
const MAX_EVENT_DURATION = 30 * 24 // giờ
const FIXED_EVENT_NAME = 'Set up time registration'

/* =================================================== */
export function EventDialog({ open, onClose, mode, title, submitLabel, defaultValues }: EventDialogProps) {
  const { toast } = useToast()

  /* ---------- 1) Đồng hồ realtime ---------- */
  const [systemTime, setSystemTime] = useState<Date>(new Date())
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* ---------- 2) minStartValue cho <Input start> ---------- */
  const minStartValue = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const d = systemTime
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }, [systemTime])

  /* ---------- 3) State form & API event ---------- */
  const [formState, setFormState] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const [openEvent, setOpenEvent] = useState<any | null>(null)

  useEffect(() => {
    if (open) {
      API_SERVICES.event
        .lay_thoi_gian_mo_don()
        .then((res) => {
          // console.log('[lay_thoi_gian_mo_don] API response:', res.data)
          setOpenEvent(res.data)
        })
        .catch((err) => {
          console.error('[lay_thoi_gian_mo_don] API error:', err)
          setOpenEvent(null)
        })
    }
  }, [open])

  useEffect(() => {
    if (defaultValues) {
      setFormState({
        start: defaultValues.start ? new Date(defaultValues.start).toISOString().slice(0, 16) : '',
        end: defaultValues.end ? new Date(defaultValues.end).toISOString().slice(0, 16) : '',
      })
    } else {
      setFormState({ start: '', end: '' })
    }
  }, [open, defaultValues])

  /* ---------- 4) Handlers ---------- */
  const handleInputChange = (field: keyof typeof formState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [field]: e.target.value })
  }

  const validateInputs = () => {
    const { start, end } = formState
    if (!start || !end) {
      toast({
        variant: 'destructive',
        title: 'Vui lòng điền đầy đủ thông tin',
      })
      return false
    }

    const startDate = new Date(start)
    const endDate = new Date(end)
    const now = new Date()

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast({ variant: 'deny', title: 'Thời gian không hợp lệ' })
      return false
    }
    /* --- KHÔNG cho quá khứ --- */
    if (startDate < now) {
      toast({
        variant: 'deny',
        title: 'Thời gian bắt đầu phải không sớm hơn hiện tại',
      })
      return false
    }
    if (endDate <= startDate) {
      toast({
        variant: 'deny',
        title: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      })
      return false
    }
    /* --- Trong năm học --- */
    if (startDate < SCHOOL_YEAR.start || endDate > SCHOOL_YEAR.end) {
      toast({
        variant: 'deny',
        title: `Thời gian phải nằm trong năm học (${SCHOOL_YEAR.start.toISOString().slice(0, 10)} đến ${SCHOOL_YEAR.end.toISOString().slice(0, 10)}) hiện tại`,
        description: `Thời gian hiện tại: ${now.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`,
      })
      return false
    }
    /* --- Kết thúc cách hiện tại ≥ 5h --- */
    const minimumEndTime = new Date(now.getTime() + 5 * 60 * 60 * 1000)
    if (endDate <= minimumEndTime) {
      toast({
        variant: 'deny',
        title: 'Thời gian kết thúc phải cách hiện tại ít nhất 5 giờ',
        description: `Kết thúc tối thiểu: ${minimumEndTime.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`,
      })
      return false
    }
    /* --- Khoảng cách giữa start & end --- */
    const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    if (diffHours < MIN_EVENT_DURATION) {
      toast({
        variant: 'destructive',
        title: 'Bắt đầu và kết thúc phải cách nhau ít nhất 5 giờ',
        description: `Thời gian tối thiểu: ${new Date(startDate.getTime() + MIN_EVENT_DURATION * 60 * 60 * 1000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`,
      })
      return false
    }
    if (diffHours > MAX_EVENT_DURATION) {
      toast({
        variant: 'destructive',
        title: `Khoảng thời gian không vượt quá ${MAX_EVENT_DURATION / 24} ngày`,
        description: `Thời gian tối đa: ${new Date(startDate.getTime() + MAX_EVENT_DURATION * 60 * 60 * 1000).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`,
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateInputs()) return
    try {
      setLoading(true)
      /* format “yyyy-MM-ddTHH:mm:ss” local */
      const formatToLocalISOString = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      }
      const formattedStart = formatToLocalISOString(new Date(formState.start))
      const formattedEnd = formatToLocalISOString(new Date(formState.end))

      console.log('[EventDialog] formattedStart:', formattedStart)
      console.log('[EventDialog] formattedEnd:', formattedEnd)

      if (openEvent) {
        await API_SERVICES.event.update_event({
          name: FIXED_EVENT_NAME,
          start: formattedStart,
          end: formattedEnd,
        })
      } else {
        await API_SERVICES.event.create_event({
          name: FIXED_EVENT_NAME,
          start: formattedStart,
          end: formattedEnd,
        })
      }
      toast({
        title: 'Thành công',
        description: openEvent ? 'Đã cập nhật thời gian mở đơn' : 'Đã tạo mới thời gian mở đơn',
        variant: 'success',
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

  /* ---------- 5) Hàm format date cho InfoRow ---------- */
  const formatDate = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  /* ---------- 6) JSX ---------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          {/* Dòng realtime */}
          <p className='text-xs text-muted-foreground'>
            {systemTime.toLocaleTimeString('vi-VN', { hour12: false })} – {systemTime.toLocaleDateString('vi-VN')}
          </p>
          <DialogTitle>{title}</DialogTitle>
          {/* dialog description */}
          <DialogDescription className='text-sm text-muted-foreground'>Đăng ký điểm đón cho học sinh.</DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {/* ---------- Input START ---------- */}
          <div className='grid gap-2'>
            <Label htmlFor='event-start'>Thời gian bắt đầu</Label>
            <Input id='event-start' type='datetime-local' value={formState.start} onChange={handleInputChange('start')} min={minStartValue} step={1} placeholder='yyyy-mm-ddThh:mm:ss' />
            <p className='text-xs text-muted-foreground'>
              • Không sớm hơn thời gian hiện tại (xem phía trên)
              <br />• Nằm trong năm học {SCHOOL_YEAR.start.toISOString().slice(0, 10)} → {SCHOOL_YEAR.end.toISOString().slice(0, 10)}
            </p>
          </div>

          {/* ---------- Input END ---------- */}
          <div className='grid gap-2'>
            <Label htmlFor='event-end'>Thời gian kết thúc</Label>
            <Input
              id='event-end'
              type='datetime-local'
              value={formState.end}
              onChange={handleInputChange('end')}
              min={minStartValue} // vẫn ép ≥ now; có thể đổi thành startDate nếu muốn
              step={1}
              placeholder='yyyy-mm-ddThh:mm:ss'
            />
            <p className='text-xs text-muted-foreground'>
              • Cách hiện tại ≥ 5 giờ và sau “Bắt đầu” ≥ 5 giờ
              <br />• Không vượt quá 30 ngày, và trong năm học
            </p>
          </div>

          {/* ---------- Bảng sự kiện đã có ---------- */}
          {openEvent && (
            <div className='mt-4'>
              <h3 className='mb-2 text-sm font-medium'>Thông tin sự kiện đã có</h3>
              <div className='w-full rounded border border-gray-100 dark:border-gray-600'>
                <table className='w-full table-fixed text-sm'>
                  <tbody>
                    <InfoRow label='Bắt đầu' value={formatDate(openEvent.start)} />
                    <InfoRow label='Kết thúc' value={formatDate(openEvent.end)} />
                    <InfoRow label='Ngày tạo' value={formatDate(openEvent.createdAt)} />
                    <InfoRow label='Cập nhật cuối' value={formatDate(openEvent.updatedAt)} />
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

/* --------------------------------------------------- */
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
