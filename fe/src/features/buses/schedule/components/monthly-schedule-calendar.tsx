'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, isWeekend, isSameDay, isAfter, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/mine/badge'

// ============== INTERFACES & MOCK DATA =================

// Mock "bus schedules" + "holidays"
const initialBusSchedules = [
  { id: 1, name: 'Lịch thường', daysOfWeek: [1, 2, 3, 4, 5], color: 'bg-blue-500/80' },
  { id: 2, name: 'Lịch đặc biệt', dates: ['2025-04-06', '2025-04-07', '2025-04-08'], color: 'bg-purple-500/80' },
]
const holidays = [
  { date: '2025-04-09', name: 'Ngày nghỉ đặc biệt', type: 'holiday' },
  { date: '2025-03-30', name: 'Ngày nghỉ cuối tháng', type: 'holiday' },
  { date: '2025-04-10', name: 'Ngày nghỉ bảo trì xe', type: 'maintenance' },
]

const CURRENT_DATE = new Date(2025, 3, 10) // 2025-04-10

// Mock submitSchedules
const submitScheduleDates = async (dates: string[]) => {
  console.log('Submitting dates:', { dates })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

// ==================== MAIN COMPONENT ====================

export default function MonthlyScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(CURRENT_DATE)
  const [busSchedules, setBusSchedules] = useState(initialBusSchedules)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Tính toán các ngày trong tháng + prev/nextMonthDays
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Tùy thích: hiển thị kèm prev/next. Đôi khi ta bỏ để giảm request
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

  // Tất cả ngày visible
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

  // Kiểm tra holiday & bus schedule
  function isHoliday(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd')
    return holidays.find((h) => h.date === dateStr)
  }

  function getBusScheduleForDate(date: Date) {
    if (isAfter(date, CURRENT_DATE)) return null
    const dayOfWeek = getDay(date)
    const dateStr = format(date, 'yyyy-MM-dd')
    if (isHoliday(date)) return null
    // special schedule
    const special = busSchedules.find((s) => s.dates?.includes(dateStr))
    if (special) return special
    // regular
    const adjusted = dayOfWeek === 0 ? 7 : dayOfWeek
    const regular = busSchedules.find((s) => s.daysOfWeek?.includes(adjusted))
    if (regular && !isWeekend(date)) return regular
    return null
  }

  // Các hàm chuyển tháng, submit, v.v.
  function prevMonth() {
    setCurrentDate(subMonths(currentDate, 1))
  }

  function nextMonth() {
    setCurrentDate(addMonths(currentDate, 1))
  }

  function goToToday() {
    setCurrentDate(CURRENT_DATE)
  }

  function handleDateSelect(date: Date) {
    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => isSameDay(d, date))
      return isSelected ? prev.filter((d) => !isSameDay(d, date)) : [...prev, date]
    })
  }

  function autoSelectNextMonth() {
    const nm = addMonths(currentDate, 1)
    const startNM = startOfMonth(nm)
    const endNM = endOfMonth(nm)
    const daysNM = eachDayOfInterval({ start: startNM, end: endNM })
    const weekdays = daysNM.filter((d) => isMonday(d) || isTuesday(d) || isWednesday(d) || isThursday(d) || isFriday(d))
    setSelectedDates(weekdays)
  }

  async function handleSubmitSchedule() {
    if (selectedDates.length === 0) return
    try {
      setIsSubmitting(true)
      const formattedDates = selectedDates.map((date) => format(date, 'yyyy-MM-dd'))
      const response = await submitScheduleDates(formattedDates)
      if (response.success) {
        const newSchedule = {
          id: busSchedules.length + 1,
          name: 'Lịch đặc biệt',
          dates: formattedDates,
          color: 'bg-purple-500/80',
        }
        setBusSchedules((prev) => [...prev, newSchedule])
        toast({
          title: 'Đăng ký lịch thành công',
          description: `Đã đăng ký ${formattedDates.length} ngày.`,
          variant: 'success',
        })
        setSelectedDates([])
        setIsSubmitDialogOpen(false)
      }
    } catch (error) {
      console.error('Error submitting schedule:', error)
      toast({
        title: 'Lỗi đăng ký lịch',
        description: 'Có lỗi khi đăng ký lịch. Vui lòng thử lại sau.',
        variant: 'deny',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format tên tháng-tiếng Việt
  const formattedMonthYear = format(currentDate, 'MMMM - yyyy', { locale: vi }).replace(/^\w/, (c) => c.toUpperCase())

  return (
    <Card className='w-full border shadow-sm'>
      <CardHeader className='px-4 pb-2 pt-4'>
        <div className='flex items-center justify-between'>
          <div className='text-lg font-medium'>{formattedMonthYear}</div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm' onClick={goToToday} className='h-8 text-xs'>
              Tháng hiện tại
            </Button>
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm' className='h-8'>
                  <Plus className='mr-1.5 h-3.5 w-3.5' /> Đăng ký lịch
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Đăng ký lịch chạy xe</DialogTitle>
                  <DialogDescription>Chọn ngày và đăng ký lịch chạy xe cho tháng tới</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-medium'>Chọn ngày</h3>
                    <Button variant='outline' size='sm' onClick={autoSelectNextMonth} className='h-8 text-xs'>
                      Chọn tháng tiếp theo
                    </Button>
                  </div>
                  <div className='rounded-md border p-2'>
                    <Calendar
                      mode='multiple'
                      selected={selectedDates}
                      onSelect={(dates) => dates && setSelectedDates(dates)}
                      classNames={{
                        day_selected: 'bg-blue-600 text-white hover:bg-blue-700',
                        day_today: 'border border-blue-500',
                      }}
                    />
                  </div>
                  <div className='rounded-md border p-3'>
                    <h4 className='mb-2 text-sm font-medium'>Ngày đã chọn ({selectedDates.length})</h4>
                    <ScrollArea className='h-[120px]'>
                      <div className='space-y-2'>
                        {selectedDates.length > 0 ? (
                          selectedDates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date, index) => (
                              <div key={index} className='flex items-center justify-between'>
                                <span className='text-sm'>{format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}</span>
                                <Button variant='ghost' size='sm' className='h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600' onClick={() => handleDateSelect(date)}>
                                  ×
                                </Button>
                              </div>
                            ))
                        ) : (
                          <div className='text-sm text-muted-foreground'>Chưa có ngày nào được chọn</div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setIsSubmitDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={handleSubmitSchedule} disabled={selectedDates.length === 0 || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng ký lịch'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className='flex'>
              <Button variant='outline' size='icon' onClick={prevMonth} className='h-8 w-8 rounded-r-none border-r-0'>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon' onClick={nextMonth} className='h-8 w-8 rounded-l-none'>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='border-t'>
          {/* Day headers */}
          <div className='grid grid-cols-7 bg-muted/20'>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
              <div key={day} className='py-2 text-center text-sm font-medium text-muted-foreground'>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className='grid grid-cols-7'>
            {allDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const isCurrentMonthDay = isSameMonth(day, currentDate)
              const isCurrentDay = isSameDay(day, CURRENT_DATE)
              const isWeekendDay = [6, 0].includes(getDay(day))
              const holiday = isHoliday(day)
              const busSchedule = getBusScheduleForDate(day)
              const dayNumber = format(day, 'd')

              // Determine text color for the day number
              let dayNumberClass = ''
              if (isWeekendDay) {
                dayNumberClass = 'text-red-600'
              } else if (!isCurrentMonthDay) {
                dayNumberClass = 'text-gray-400'
              }

              return (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn('relative h-24 border-b border-r p-1 sm:h-28', !isCurrentMonthDay && 'text-muted-foreground/50', isWeekendDay ? 'bg-muted/10' : '', isCurrentDay && 'bg-amber-100 dark:bg-amber-950/20', i % 7 === 6 && 'border-r-0')}>
                        {/* Day number */}
                        <div className={cn('text-center text-xl font-medium', dayNumberClass)}>{dayNumber}</div>

                        {/* holiday / schedule */}
                        <div className='mt-3 flex items-center justify-center gap-1'>
                          {holiday && <Badge color={holiday.type === 'holiday' ? 'red' : 'yellow'}>{holiday.type === 'holiday' ? 'Nghỉ' : 'Bảo trì'}</Badge>}
                          {!holiday && busSchedule && <Badge color={busSchedule.name === 'Lịch thường' ? 'blue' : 'purple'}>{busSchedule.name === 'Lịch thường' ? 'Thường lệ' : 'Đặc biệt'}</Badge>}
                        </div>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent side='top'>
                      <div className='text-sm font-medium'>{format(day, 'EEEE, d MMMM, yyyy', { locale: vi })}</div>

                      {/* holiday / schedule */}
                      {holiday ? (
                        <div className='mt-1 flex items-center gap-1'>
                          <Badge color={holiday.type === 'holiday' ? 'red' : 'yellow'}>{holiday.type === 'holiday' ? 'Ngày nghỉ' : 'Bảo trì'}</Badge>
                          <span className='text-xs'>{holiday.name}</span>
                        </div>
                      ) : busSchedule ? (
                        <div className='mt-1 flex items-center gap-1'>
                          <Badge color={busSchedule.name === 'Lịch thường' ? 'blue' : 'purple'}>{busSchedule.name}</Badge>
                        </div>
                      ) : isAfter(day, CURRENT_DATE) ? (
                        <div className='mt-1 text-xs text-muted-foreground'>Chưa có lịch đăng ký</div>
                      ) : (
                        <div className='mt-1 text-xs text-muted-foreground'>Không có lịch chạy xe</div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
