//file url : fe/src/components/mine/loader/advanced-bus-loader.tsx
import type React from 'react'
import { Bus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface BusLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the loader
   * - sm: Small (good for inline or small components)
   * - md: Medium (default, good for cards or sections)
   * - lg: Large (good for larger sections)
   * - xl: Extra large (good for prominent areas)
   * - 2xl: Double extra large (good for hero sections)
   * - full: Full screen (covers the entire viewport)
   */
  size?: LoaderSize
  /**
   * Show text below the loader
   */
  showText?: boolean
  /**
   * Custom text to display
   */
  text?: string
  /**
   * Color theme for the loader
   */
  variant?: 'primary' | 'secondary' | 'default'
}

const sizeMap = {
  sm: {
    wrapper: 'h-8 gap-2',
    icon: 'w-5 h-5',
    text: 'text-xs',
  },
  md: {
    wrapper: 'h-16 gap-3',
    icon: 'w-8 h-8',
    text: 'text-sm',
  },
  lg: {
    wrapper: 'h-24 gap-4',
    icon: 'w-12 h-12',
    text: 'text-base',
  },
  xl: {
    wrapper: 'h-32 gap-5',
    icon: 'w-16 h-16',
    text: 'text-lg',
  },
  '2xl': {
    wrapper: 'h-40 gap-6',
    icon: 'w-20 h-20',
    text: 'text-xl',
  },
  full: {
    wrapper: 'h-screen gap-8',
    icon: 'w-24 h-24',
    text: 'text-2xl',
  },
}

const variantMap = {
  primary: {
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
  },
  secondary: {
    icon: 'text-gray-600 dark:text-gray-400',
    text: 'text-gray-700 dark:text-gray-300',
  },
  default: {
    icon: 'text-primary',
    text: 'text-muted-foreground',
  },
}

export const BusLoader = ({ size = 'md', showText = true, text = 'Loading...', variant = 'default', className, ...props }: BusLoaderProps) => {
  const sizeClasses = sizeMap[size]
  const variantClasses = variantMap[variant]

  const isFullScreen = size === 'full'

  return (
    <div className={cn('flex flex-col items-center justify-center', isFullScreen && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm', sizeClasses.wrapper, className)} {...props}>
      <div className='relative animate-bounce'>
        <Bus className={cn('animate-pulse', sizeClasses.icon, variantClasses.icon)} />
      </div>
      {showText && <p className={cn('animate-pulse font-medium', sizeClasses.text, variantClasses.text)}>{text}</p>}
    </div>
  )
}
