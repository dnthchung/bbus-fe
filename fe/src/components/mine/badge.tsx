import type React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  className?: string
}

const colorStyles = {
  gray: 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700/30',
  red: 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-500/20',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-950/50 dark:text-yellow-400 dark:ring-yellow-500/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/50 dark:text-green-400 dark:ring-green-500/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-950/50 dark:text-purple-400 dark:ring-purple-500/20',
  pink: 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-950/50 dark:text-pink-400 dark:ring-pink-500/20',
}

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  return <span className={cn('inline-flex h-5 w-16 items-center justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset', colorStyles[color], className)}>{children}</span>
}
