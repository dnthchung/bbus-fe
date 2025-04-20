import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

//path : fe/src/components/common/mine/status.tsx

type StatusProps = {
  children: ReactNode
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  className?: string
  showDot?: boolean
}

//using example without dot  : <Status color='red' showDot={false}>Đang chờ</Status>

const colorStyles = {
  gray: {
    colors: 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700/30',
    dotColor: 'bg-gray-500 dark:bg-gray-400',
  },
  red: {
    colors: 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-500/30',
    dotColor: 'bg-red-500 dark:bg-red-400',
  },
  yellow: {
    colors: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-950/50 dark:text-yellow-400 dark:ring-yellow-500/30',
    dotColor: 'bg-yellow-500 dark:bg-yellow-400',
  },
  green: {
    colors: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/50 dark:text-green-400 dark:ring-green-500/30',
    dotColor: 'bg-green-500 dark:bg-green-400',
  },
  blue: {
    colors: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/30',
    dotColor: 'bg-blue-500 dark:bg-blue-400',
  },
  indigo: {
    colors: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/30',
    dotColor: 'bg-indigo-500 dark:bg-indigo-400',
  },
  purple: {
    colors: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-950/50 dark:text-purple-400 dark:ring-purple-500/30',
    dotColor: 'bg-purple-500 dark:bg-purple-400',
  },
  pink: {
    colors: 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-950/50 dark:text-pink-400 dark:ring-pink-500/30',
    dotColor: 'bg-pink-500 dark:bg-pink-400',
  },
}

export function Status({ children, color = 'gray', className, showDot = true }: StatusProps) {
  const config = colorStyles[color]

  return (
    <span className={cn('inline-flex h-6 items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset', config.colors, className)}>
      {showDot && <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', config.dotColor)} />}
      {children}
    </span>
  )
}
