import React, { createContext, useContext, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getScheduledDatesByMonth } from '@/features/buses/buses'

interface ScheduleContextType {
  // 1) Scheduled dates data
  scheduledDates: string[]
  loading: boolean
  error: Error | null
  currentMonth: Date

  // 2) Functions to manage schedule
  refreshSchedule: (date?: Date) => Promise<void>
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export function useSchedule() {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}

interface Props {
  children: React.ReactNode
}

export default function ScheduleProvider({ children }: Props) {
  const [scheduledDates, setScheduledDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Function to refresh schedule data
  const refreshSchedule = async (date?: Date) => {
    try {
      setLoading(true)
      const targetDate = date || currentMonth
      const monthStr = format(targetDate, 'yyyy-MM')
      const dates = await getScheduledDatesByMonth(monthStr)
      setScheduledDates(dates)
      setError(null)
    } catch (err) {
      console.error('Error fetching schedule:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    refreshSchedule(currentMonth)
  }, [currentMonth])

  return (
    <ScheduleContext.Provider
      value={{
        scheduledDates,
        loading,
        error,
        currentMonth,
        refreshSchedule,
        setCurrentMonth,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}
