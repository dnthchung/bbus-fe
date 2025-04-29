import React, { useState, useRef } from 'react'
import { Eye, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface AnalyticsCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  changeText?: string
  changeTextVariant?: 'green' | 'red' | null
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon = <Eye className='h-4 w-4 text-gray-600 dark:text-gray-300' />, label = 'Page Views', value = '12,450', changeText, changeTextVariant }) => {
  // State to control tooltip visibility
  const [showChangeTooltip, setShowChangeTooltip] = useState(false)

  // References for positioning tooltips
  const changeTextRef = useRef<HTMLDivElement>(null)

  // Function to truncate text with ellipsis if it exceeds certain length
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Get the full texts and their truncated versions
  const fullChangeText = changeText || ''
  const truncatedChangeText = changeText ? truncateText(changeText, 25) : ''

  // Determine color class for change text
  const getChangeColorClasses = () => {
    if (changeTextVariant === 'green') {
      return 'text-green-600 dark:text-green-400'
    } else if (changeTextVariant === 'red') {
      return 'text-red-600 dark:text-red-400'
    }
    return 'text-gray-500 dark:text-gray-400'
  }

  // Get appropriate icon for change text
  const getChangeIcon = () => {
    if (changeTextVariant === 'green') {
      return <ArrowUpRight className='h-3 w-3 text-green-600 dark:text-green-400' />
    } else if (changeTextVariant === 'red') {
      return <ArrowDownRight className='h-3 w-3 text-red-600 dark:text-red-400' />
    }
    return null
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>{icon}</div>
          <div className='relative'>
            <span className='block max-w-[150px] text-sm font-medium leading-tight text-gray-800 dark:text-gray-100'>{label}</span>
          </div>
        </div>
        <button className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'>
          <Info className='h-5 w-5' />
        </button>
      </div>

      <div className='flex items-center gap-3'>
        <span className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>{value}</span>
      </div>

      {changeText && (
        <div className='relative mt-2'>
          <div ref={changeTextRef} className={`flex items-center gap-1 text-xs ${getChangeColorClasses()}`} onMouseEnter={() => fullChangeText.length > 25 && setShowChangeTooltip(true)} onMouseLeave={() => setShowChangeTooltip(false)}>
            {getChangeIcon()}
            <span>{truncatedChangeText}</span>
          </div>
          {showChangeTooltip && fullChangeText.length > 25 && <div className='absolute left-0 top-6 z-10 w-max max-w-xs rounded-md bg-gray-800 p-2 text-xs text-white shadow-lg'>{fullChangeText}</div>}
        </div>
      )}
    </div>
  )
}

// Export the component and its props interface for use in other files
export { AnalyticsCard }
export type { AnalyticsCardProps }

// Also provide a default export for convenience
export default AnalyticsCard
