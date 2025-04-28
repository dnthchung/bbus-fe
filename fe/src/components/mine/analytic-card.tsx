import type React from 'react'
import { Eye, Info } from 'lucide-react'

interface AnalyticsCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
}

export default function AnalyticsCard({ icon = <Eye className='h-4 w-4 text-gray-600' />, label = 'Page Views', value = '12,450', change }: AnalyticsCardProps) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100'>{icon}</div>
          <span className='text-xl font-medium text-gray-800'>{label}</span>
        </div>
        <button className='text-gray-400 hover:text-gray-600'>
          <Info className='h-5 w-5' />
        </button>
      </div>

      <div className='flex items-center gap-3'>
        <span className='font-semi-bold text-2xl'>{value}</span>
        {change && (
          <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${change.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
        )}
      </div>
    </div>
  )
}

//basic usage example
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
