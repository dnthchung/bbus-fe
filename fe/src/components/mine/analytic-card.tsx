import React, { useState, useRef } from 'react'
import { Eye, Info } from 'lucide-react'

interface AnalyticsCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  changeText?: string
  changeTextVariant?: string
  //green - red - null = default
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon = <Eye className='h-4 w-4 text-gray-600 dark:text-gray-300' />, label = 'Page Views', value = '12,450', changeText }: AnalyticsCardProps) => {
  // State to control tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false)

  // References for positioning tooltips
  const labelRef = useRef<HTMLSpanElement>(null)
  const changeTextRef = useRef<HTMLParagraphElement>(null)

  // Function to truncate text with ellipsis if it exceeds certain length
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Get the full texts and their truncated versions
  const fullLabel = label
  const truncatedLabel = truncateText(label, 20)

  const fullChangeText = changeText || ''
  const truncatedChangeText = changeText ? truncateText(changeText, 25) : ''

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>{icon}</div>
          <div className='relative'>
            <span ref={labelRef} className='break-words text-sm font-medium text-gray-800 dark:text-gray-100' onMouseEnter={() => fullLabel.length > 20 && setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
              {truncatedLabel}
            </span>
            {showTooltip && fullLabel.length > 20 && <div className='absolute left-0 top-6 z-10 w-max max-w-xs rounded-md bg-gray-800 p-2 text-xs text-white shadow-lg'>{fullLabel}</div>}
          </div>
        </div>
        <button className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'>
          <Info className='h-5 w-5' />
        </button>
      </div>
      <div className='flex items-center gap-3'>
        <span className='font-semi-bold text-2xl text-gray-800 dark:text-gray-100'>{value}</span>
      </div>
      {changeText && (
        <div className='relative'>
          <p ref={changeTextRef} className='text-xs text-muted-foreground' onMouseEnter={() => fullChangeText.length > 40 && setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            {truncatedChangeText}
          </p>
          {showTooltip && fullChangeText.length > 40 && <div className='absolute left-0 top-6 z-10 w-max max-w-xs rounded-md bg-gray-800 p-2 text-xs text-white shadow-lg'>{fullChangeText}</div>}
        </div>
      )}
    </div>
  )
}

export default AnalyticsCard

{
  /*
<AnalyticsCard
    label="Page Views"
    value="12,450"
    change={{ value: 15.8, isPositive: true }}
/>

<AnalyticsCard
    icon={<Users className="w-4 h-4 text-gray-600" />}
    label="Total Users"
    value="1,234"
    change={{ value: 5.3, isPositive: true }}
/> */
}
