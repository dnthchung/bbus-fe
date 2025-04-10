"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { format, isValid, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateDialogProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  format?: string
  minDate?: Date
  maxDate?: Date
}

export function DateDialog({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled = false,
  className,
  format: dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
}: DateDialogProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(value ? format(value, dateFormat) : "")
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year">("day")
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(value)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(value?.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(value ? value.getMonth() : undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  // Tạo danh sách năm (từ 1900 đến năm hiện tại + 10)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => currentYear + 10 - i)

  // Tạo danh sách tháng
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i, 1), "MMMM", { locale: vi }),
  }))

  // Cập nhật input value khi value thay đổi
  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, dateFormat))
      setCalendarDate(value)
      setSelectedYear(value.getFullYear())
      setSelectedMonth(value.getMonth())
    } else {
      setInputValue("")
      setCalendarDate(undefined)
    }
  }, [value, dateFormat])

  // Xử lý khi người dùng nhập vào input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Thử parse giá trị nhập vào thành date
    try {
      const parsedDate = parse(newValue, dateFormat, new Date())
      if (isValid(parsedDate)) {
        setCalendarDate(parsedDate)
        setSelectedYear(parsedDate.getFullYear())
        setSelectedMonth(parsedDate.getMonth())

        // Kiểm tra min/max date
        if (minDate && parsedDate < minDate) return
        if (maxDate && parsedDate > maxDate) return

        onChange(parsedDate)
      }
    } catch (error) {
      // Không làm gì nếu parse thất bại
    }
  }

  // Xử lý khi người dùng chọn năm
  const handleYearChange = (year: string) => {
    const numYear = Number.parseInt(year)
    setSelectedYear(numYear)

    if (selectedMonth !== undefined) {
      const newDate = new Date(numYear, selectedMonth, 15)
      setCalendarDate(newDate)
      setCalendarView("month")
    } else {
      setCalendarView("month")
    }
  }

  // Xử lý khi người dùng chọn tháng
  const handleMonthChange = (month: string) => {
    const numMonth = Number.parseInt(month)
    setSelectedMonth(numMonth)

    if (selectedYear !== undefined) {
      const newDate = new Date(selectedYear, numMonth, 15)
      setCalendarDate(newDate)
      setCalendarView("day")
    }
  }

  // Xử lý khi người dùng chọn ngày từ calendar
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date)
      setInputValue(format(date, dateFormat))
      setOpen(false)
    }
  }

  // Xử lý khi người dùng focus vào input
  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true)
      inputRef.current?.select()
    }
  }

  // Render calendar view dựa trên trạng thái hiện tại
  const renderCalendarView = () => {
    switch (calendarView) {
      case "year":
        return (
          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const startYear = years[years.length - 1] - 10
                  years.splice(0, 0, ...Array.from({ length: 10 }, (_, i) => startYear + i))
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">Chọn năm</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const endYear = years[0] + 1
                  years.unshift(...Array.from({ length: 10 }, (_, i) => endYear + i))
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {years.slice(0, 20).map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  className="h-9"
                  onClick={() => handleYearChange(year.toString())}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        )

      case "month":
        return (
          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" onClick={() => setCalendarView("year")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setCalendarView("year")}>
                {selectedYear}
              </Button>
              <div className="w-9"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant={selectedMonth === month.value ? "default" : "outline"}
                  className="h-9"
                  onClick={() => handleMonthChange(month.value.toString())}
                >
                  {month.label.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="p-0">
            <div className="flex items-center justify-between px-3 pt-3">
              <Button variant="ghost" size="sm" onClick={() => setCalendarView("month")}>
                {selectedMonth !== undefined && selectedYear !== undefined
                  ? format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy", { locale: vi })
                  : "Chọn tháng"}
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                return false
              }}
              initialFocus
            />
          </div>
        )
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              disabled={disabled}
              className="pr-10"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {renderCalendarView()}
        </PopoverContent>
      </Popover>
    </div>
  )
}
