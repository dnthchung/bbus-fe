'use client'

import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, isSameDay, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSchedule } from '@/features/buses/context/schedule-context'

const getCurrentDate = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

export default function MonthlyScheduleCalendar() {
  // Use the schedule context
  const { scheduledDates, loading, error, currentMonth, setCurrentMonth, refreshSchedule } = useSchedule()
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(getCurrentDate())

  const autoSelectNextMonth = () => {
    // Get the current real-time date and month from user's machine
    const realTimeToday = new Date()
    const realTimeCurrentMonth = new Date(realTimeToday.getFullYear(), realTimeToday.getMonth(), 1)

    // Calculate the next month based on the user's current real-time month
    const nextMonth = addMonths(realTimeCurrentMonth, 1)

    const days = eachDayOfInterval({
      start: startOfMonth(nextMonth),
      end: endOfMonth(nextMonth),
    })

    // Filter weekdays that are not before the current real-time date
    const weekdays = days.filter((d) => (isMonday(d) || isTuesday(d) || isWednesday(d) || isThursday(d) || isFriday(d)) && d >= realTimeToday)

    setSelectedDates(weekdays)

    // Update the calendar view inside the dialog to show the next month
    setCalendarMonth(nextMonth)
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

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => (prev.some((d) => isSameDay(d, date)) ? prev.filter((d) => !isSameDay(d, date)) : [...prev, date]))
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
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <button className='flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700'>
                <Plus className='mr-1.5 h-3.5 w-3.5' /> Đăng ký lịch
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
                    <Button variant='outline' size='sm' onClick={autoSelectNextMonth} className='h-8 text-xs'>
                      Chọn tháng tiếp theo
                    </Button>
                  </div>
                  <div className='flex flex-col justify-center gap-4 rounded-md border py-4 sm:flex-row sm:items-start sm:gap-x-6'>
                    <div className='p-2'>
                      <Calendar
                        mode='multiple'
                        selected={selectedDates}
                        onSelect={(dates) => dates && setSelectedDates(dates)}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        classNames={{
                          day_selected: 'bg-blue-600 text-white hover:bg-blue-700',
                          day_today: 'border border-blue-500',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='mb-2 mt-1 flex items-center justify-between py-3'>
                    <p className='text-sm font-medium'>Ngày đã chọn ({selectedDates.length})</p>
                    <button onClick={() => setSelectedDates([])} className='text-xs text-red-500 hover:underline'>
                      Xoá tất cả
                    </button>
                  </div>
                  <div className='max-h-64 overflow-y-auto rounded-md border p-2 text-sm'>
                    {selectedDates.length > 0 ? (
                      <ul className='space-y-1'>
                        {selectedDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .map((date, index) => (
                            <li key={index} className='flex items-center justify-between'>
                              <span>{format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}</span>
                              <button className='ml-2 h-6 w-6 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600' onClick={() => handleDateSelect(date)}>
                                ×
                              </button>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className='text-muted-foreground'>Chưa có ngày nào được chọn</p>
                    )}
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
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý...
                    </>
                  ) : (
                    'Đăng ký lịch'
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
            const dayNumber = format(day, 'd')
            let dayNumberClass = ''
            if (isWeekendDay) dayNumberClass = 'text-red-600'
            else if (!isCurrentMonthDay) dayNumberClass = 'text-gray-400'
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn('relative h-24 border-b border-r p-1 sm:h-28', !isCurrentMonthDay && 'text-gray-400', isWeekendDay ? 'bg-gray-50/50 dark:bg-gray-900/50' : '', isCurrentDay && 'bg-amber-100 dark:bg-amber-950/20', i % 7 === 6 && 'border-r-0')}>
                      <div className={cn('text-center text-xl font-medium', dayNumberClass)}>{dayNumber}</div>
                      <div className='mt-3 flex items-center justify-center'>{isActive && <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300'>Hoạt động</span>}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top'>
                    <div className='text-sm font-medium'>{format(day, 'EEEE, d MMMM, yyyy', { locale: vi })}</div>
                    {isActive ? <div className='mt-1 text-xs text-green-600 dark:text-green-300'>Xe bus hoạt động</div> : <div className='mt-1 text-xs text-muted-foreground'>Không có lịch chạy</div>}
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
    </section>
  )
}
