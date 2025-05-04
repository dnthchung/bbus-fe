'use client'

//url file : fe/src/features/buses/schedule/components/monthly-schedule-calendar.tsx
import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, isSameDay, isMonday, isTuesday, isWednesday, isThursday, isFriday, isPast } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Loader2, X, AlertTriangle } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getScheduledDatesByMonth, deleteScheduledDates } from '@/features/buses/buses'
import { useSchedule } from '@/features/buses/context/schedule-context'

const getCurrentDate = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

export default function MonthlyScheduleCalendar() {
  // Use the schedule context
  const { scheduledDates, loading, error, currentMonth, setCurrentMonth, refreshSchedule } = useSchedule()
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [scheduledDateObjects, setScheduledDateObjects] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(getCurrentDate())
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // New state for confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [dateToDelete, setDateToDelete] = useState<Date | null>(null)

  // Load scheduled dates when dialog opens or month changes
  useEffect(() => {
    if (isSubmitDialogOpen) {
      loadScheduledDatesForDialog()
    }
  }, [isSubmitDialogOpen, calendarMonth])

  // Convert string dates to Date objects
  const loadScheduledDatesForDialog = async () => {
    try {
      const monthStr = format(calendarMonth, 'yyyy-MM')
      const dates = await getScheduledDatesByMonth(monthStr)
      // Convert string dates to Date objects
      const dateObjects = dates.map((dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month - 1, day)
      })
      setScheduledDateObjects(dateObjects)
    } catch (error) {
      console.error('Error loading scheduled dates for dialog:', error)
    }
  }

  // Get all weekdays (Monday to Friday) in the current calendar month that are not in the past
  const getAvailableWeekdays = () => {
    const today = new Date()
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(calendarMonth)

    const days = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    })

    // Filter for weekdays (Monday to Friday) that are not in the past
    return days.filter((d) => (isMonday(d) || isTuesday(d) || isWednesday(d) || isThursday(d) || isFriday(d)) && d >= today)
  }

  // Check if there are any unscheduled weekdays in the current calendar month
  const hasUnscheduledWeekdays = () => {
    const availableWeekdays = getAvailableWeekdays()
    return availableWeekdays.some((date) => !isDateScheduled(date))
  }

  // Select all unscheduled weekdays in the current calendar month
  const selectAllUnscheduledWeekdays = () => {
    const availableWeekdays = getAvailableWeekdays()
    const unscheduledWeekdays = availableWeekdays.filter((date) => !isDateScheduled(date))
    setSelectedDates(unscheduledWeekdays)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)
  const endDay = getDay(monthEnd)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1
  const prevMonthDays = Array.from({ length: adjustedStartDay }, (_, i) => {
    const d = new Date(monthStart)
    d.setDate(i - adjustedStartDay + 1)
    return d
  })
  const nextMonthDays = Array.from({ length: 6 - (endDay === 0 ? 6 : endDay - 1) }, (_, i) => {
    const d = new Date(monthEnd)
    d.setDate(monthEnd.getDate() + i + 1)
    return d
  })
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]
  const isBusActive = (date: Date) => scheduledDates.includes(format(date, 'yyyy-MM-dd'))

  // Check if a date is already scheduled in the dialog calendar
  const isDateScheduled = (date: Date) => scheduledDateObjects.some((scheduledDate) => isSameDay(scheduledDate, date))

  // Check if a date is in the past
  const isDatePast = (date: Date) => isPast(date) && !isSameDay(date, getCurrentDate())

  // New function to handle individual date deletion confirmation
  const handleConfirmDelete = (date: Date) => {
    setDateToDelete(date)
    setIsConfirmDialogOpen(true)
  }

  // New function to delete a single date
  const deleteSingleDate = async () => {
    if (!dateToDelete) return

    try {
      setIsDeleting(true)
      const formatted = format(dateToDelete, 'yyyy-MM-dd')
      const success = await deleteScheduledDates(formatted)

      if (success) {
        toast({
          title: 'Xóa lịch thành công',
          description: `Đã xóa ngày ${format(dateToDelete, 'dd/MM/yyyy')}.`,
          variant: 'success',
        })

        // Refresh the scheduled dates in the dialog
        await loadScheduledDatesForDialog()
        // Refresh the main calendar
        await refreshSchedule(currentMonth)
      }
    } catch {
      toast({
        title: 'Lỗi xóa lịch',
        description: 'Vui lòng thử lại.',
        variant: 'deny',
      })
    } finally {
      setIsDeleting(false)
      setIsConfirmDialogOpen(false)
      setDateToDelete(null)
    }
  }

  const handleSubmitSchedule = async () => {
    if (selectedDates.length === 0) return

    try {
      setIsSubmitting(true)
      const formatted = selectedDates.map((d) => format(d, 'yyyy-MM-dd'))
      const response = await API_SERVICES.bus_schedule.assign_batch(formatted)

      if (response.success || response.status === 200) {
        toast({
          title: 'Đăng ký lịch thành công',
          description: `Đã đăng ký ${formatted.length} ngày.`,
          variant: 'success',
        })
        setSelectedDates([])
        setIsSubmitDialogOpen(false)
        // Refresh the schedule after successful submission
        await refreshSchedule(currentMonth)
      }
    } catch {
      toast({
        title: 'Lỗi đăng ký lịch',
        description: 'Vui lòng thử lại.',
        variant: 'deny',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const today = getCurrentDate()
  const formattedMonthYear = format(currentMonth, 'MMMM - yyyy', { locale: vi }).replace(/^\w/, (c) => c.toUpperCase())

  return (
    <section className='w-full rounded-lg border bg-white shadow-sm dark:bg-slate-950'>
      <header className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-medium'>{formattedMonthYear}</h2>
        <div className='flex flex-wrap gap-2'>
          <button onClick={() => setCurrentMonth(today)} className='rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800'>
            Tháng hiện tại
          </button>
          <Dialog
            open={isSubmitDialogOpen}
            onOpenChange={(open) => {
              setIsSubmitDialogOpen(open)
              if (!open) {
                setIsEditMode(false)
              }
            }}
          >
            <DialogTrigger asChild>
              <button className='flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700'>
                <Plus className='mr-1.5 h-3.5 w-3.5' />
                Đăng ký lịch
              </button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl'>
              <DialogHeader>
                <DialogTitle>Đăng ký lịch chạy xe</DialogTitle>
                <DialogDescription>Chọn ngày và đăng ký lịch chạy xe cho tháng tới</DialogDescription>
              </DialogHeader>
              <div className='flex flex-col gap-4 py-4 sm:flex-row sm:gap-x-6'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center justify-between py-2'>
                    <p className='text-sm font-medium'>Chọn ngày</p>
                    <Button variant='outline' size='sm' onClick={selectAllUnscheduledWeekdays} className='h-8 text-xs' disabled={isEditMode || !hasUnscheduledWeekdays()}>
                      Chọn tất cả các ngày trong tuần
                    </Button>
                  </div>
                  <div className='flex flex-col justify-center gap-4 rounded-md border py-4 sm:flex-row sm:items-start sm:gap-x-6'>
                    <div className='p-2'>
                      <Calendar
                        mode='multiple'
                        selected={selectedDates}
                        onSelect={(dates) => {
                          // Only allow selecting dates that aren't already scheduled
                          if (dates) {
                            const filteredDates = dates.filter((date) => !scheduledDateObjects.some((scheduledDate) => isSameDay(scheduledDate, date)))
                            setSelectedDates(filteredDates)
                          }
                        }}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={(date) => {
                          const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0))
                          // Disable already scheduled dates and past dates
                          return isPastDate || isDateScheduled(date)
                        }}
                        classNames={{
                          day_selected: 'bg-blue-600 text-white hover:bg-blue-700',
                          day_today: 'border border-blue-500',
                        }}
                        modifiers={{
                          scheduled: scheduledDateObjects.map((date) => new Date(date)),
                        }}
                        modifiersClassNames={{
                          scheduled: 'bg-blue-100 text-blue-900 hover:bg-blue-200',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='mb-2 mt-1 flex items-center justify-between py-3'>
                    <p className='text-sm font-medium'>{`Ngày đã đăng ký (${scheduledDateObjects.length})`}</p>
                    <button onClick={toggleEditMode} className={`text-xs ${isEditMode ? 'text-blue-500' : 'text-amber-500'} hover:underline`}>
                      {isEditMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                    </button>
                  </div>
                  <div className='rounded-md border'>
                    <div className='max-h-64 overflow-y-auto p-2 text-sm'>
                      {scheduledDateObjects.length > 0 ? (
                        <table className='w-full'>
                          <tbody className='divide-y'>
                            {scheduledDateObjects
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date, index) => {
                                const isPastDate = isDatePast(date)
                                return (
                                  <tr key={index} className={`${isPastDate ? 'text-gray-400' : ''}`}>
                                    <td className='py-1.5'>{format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}</td>
                                    <td className='w-10 text-right'>
                                      {isEditMode && !isPastDate && !isSameDay(date, today) && (
                                        <button className='ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600' onClick={() => handleConfirmDelete(date)}>
                                          <X className='h-4 w-4' />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                      ) : (
                        <p className='py-2 text-center text-muted-foreground'>Chưa có ngày nào được đăng ký</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button className='rounded-md border px-4 py-2 text-sm hover:bg-gray-50' onClick={() => setIsSubmitDialogOpen(false)}>
                  Hủy
                </button>
                <button className='rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50' onClick={handleSubmitSchedule} disabled={selectedDates.length === 0 || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Đang xử lý...
                    </>
                  ) : (
                    'Lưu'
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className='flex'>
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className='flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 hover:bg-gray-50 dark:hover:bg-gray-800'>
              <ChevronLeft className='h-4 w-4' />
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className='flex h-8 w-8 items-center justify-center rounded-r-md border hover:bg-gray-50 dark:hover:bg-gray-800'>
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </header>
      {/* Rest of the component remains the same */}
      <div className='border-t'>
        <div className='grid grid-cols-7 bg-gray-50 dark:bg-gray-900'>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <div key={day} className='py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400'>
              {day}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-7'>
          {allDays.map((day, i) => {
            const isCurrentMonthDay = isSameMonth(day, currentMonth)
            const isCurrentDay = isSameDay(day, today)
            const isWeekendDay = [6, 0].includes(getDay(day))
            const isActive = isBusActive(day)
            const isPastDay = isDatePast(day)
            const dayNumber = format(day, 'd')

            let dayNumberClass = ''
            if (isWeekendDay) dayNumberClass = 'text-red-600'
            else if (!isCurrentMonthDay) dayNumberClass = 'text-gray-400'

            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn('relative h-24 border-b border-r p-1 sm:h-28', !isCurrentMonthDay && 'text-gray-400', isWeekendDay ? 'bg-gray-50/50 dark:bg-gray-900/50' : '', isCurrentDay && 'bg-amber-100 dark:bg-amber-950/20', isActive && isPastDay && 'bg-gray-100 dark:bg-gray-800/50', isActive && !isPastDay && 'bg-green-50 dark:bg-green-950/20', i % 7 === 6 && 'border-r-0')}>
                      <div className={cn('text-center text-xl font-medium', dayNumberClass)}>{dayNumber}</div>
                      <div className='mt-3 flex items-center justify-center'>{isActive && <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', isPastDay ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300')}>{isPastDay ? 'Đã hoạt động' : 'Hoạt động'}</span>}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top'>
                    <div className='text-sm font-medium'>{format(day, 'EEEE, d MMMM, yyyy', { locale: vi })}</div>
                    {isActive ? <div className={cn('mt-1 text-xs', isPastDay ? 'text-gray-500' : 'text-green-600 dark:text-green-300')}>{isPastDay ? 'Xe bus đã hoạt động' : 'Xe bus hoạt động'}</div> : <div className='mt-1 text-xs text-muted-foreground'>Không có lịch chạy</div>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
      {loading && (
        <div className='flex items-center justify-center p-4'>
          <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
          <span className='ml-2'>Đang tải lịch...</span>
        </div>
      )}
      {error && <div className='p-4 text-center text-red-500'>Lỗi khi tải lịch: {error.message}</div>}

      {/* Confirmation Dialog for deleting a single date */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
              Xác nhận xóa lịch
            </DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa ngày {dateToDelete ? format(dateToDelete, 'dd/MM/yyyy', { locale: vi }) : ''}?</DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-end'>
            <Button type='button' variant='outline' onClick={() => setIsConfirmDialogOpen(false)}>
              Hủy
            </Button>
            <Button type='button' variant='destructive' onClick={deleteSingleDate} disabled={isDeleting} className='bg-red-600 hover:bg-red-700'>
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Xóa lịch'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
