// fe/src/components/ui/custom-caption.tsx
import * as React from 'react'
import { useNavigation } from 'react-day-picker'

export function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const { goToMonth } = useNavigation()
  const currentYear = displayMonth.getFullYear()

  const years = React.useMemo(() => {
    const fromYear = 1970
    const toYear = new Date().getFullYear() + 10
    return Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i)
  }, [])

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.currentTarget.value)
    const newDate = new Date(displayMonth)
    newDate.setMonth(month)
    goToMonth(newDate)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.currentTarget.value)
    const newDate = new Date(displayMonth)
    newDate.setFullYear(year)
    goToMonth(newDate)
  }

  return (
    <div className='flex space-x-2'>
      <select className='rounded border px-2 py-1 text-sm' value={displayMonth.getMonth()} onChange={handleMonthChange}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      <select className='rounded border px-2 py-1 text-sm' value={currentYear} onChange={handleYearChange}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}
