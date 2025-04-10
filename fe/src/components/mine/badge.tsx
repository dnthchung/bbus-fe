import type React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'soft'
}

const colorVariants = {
  solid: {
    gray: 'bg-gray-600 text-white dark:bg-gray-700',
    red: 'bg-red-600 text-white dark:bg-red-700',
    yellow: 'bg-yellow-600 text-white dark:bg-yellow-700',
    green: 'bg-green-600 text-white dark:bg-green-700',
    blue: 'bg-blue-600 text-white dark:bg-blue-700',
    indigo: 'bg-indigo-600 text-white dark:bg-indigo-700',
    purple: 'bg-purple-600 text-white dark:bg-purple-700',
    pink: 'bg-pink-600 text-white dark:bg-pink-700',
  },
  outline: {
    gray: 'border border-gray-500 text-gray-700 dark:border-gray-400 dark:text-gray-300',
    red: 'border border-red-500 text-red-700 dark:border-red-400 dark:text-red-300',
    yellow: 'border border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300',
    green: 'border border-green-500 text-green-700 dark:border-green-400 dark:text-green-300',
    blue: 'border border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300',
    indigo: 'border border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300',
    purple: 'border border-purple-500 text-purple-700 dark:border-purple-400 dark:text-purple-300',
    pink: 'border border-pink-500 text-pink-700 dark:border-pink-400 dark:text-pink-300',
  },
  soft: {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200',
  },
}

const sizeVariants = {
  sm: 'text-xs px-1.5 py-0.5 rounded',
  md: 'text-xs px-2 py-1 rounded-md',
  lg: 'text-sm px-2.5 py-1 rounded-md',
}

export function Badge({ children, color = 'gray', className, size = 'md', variant = 'soft' }: BadgeProps) {
  return <span className={cn('inline-flex items-center justify-center font-medium', sizeVariants[size], colorVariants[variant][color], className)}>{children}</span>
}
