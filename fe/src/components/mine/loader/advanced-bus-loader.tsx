'use client'

//file url : fe/src/components/mine/loader/advanced-bus-loader.tsx
import type React from 'react'
import { Bus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface AdvancedBusLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /**
   * Animation style
   */
  animation?: 'bounce' | 'pulse' | 'drive' | 'spin'
}

const sizeMap = {
  sm: {
    wrapper: 'h-8 gap-2',
    icon: 'w-5 h-5',
    text: 'text-xs',
    road: 'h-[2px] w-16',
  },
  md: {
    wrapper: 'h-16 gap-3',
    icon: 'w-8 h-8',
    text: 'text-sm',
    road: 'h-[3px] w-32',
  },
  lg: {
    wrapper: 'h-24 gap-4',
    icon: 'w-12 h-12',
    text: 'text-base',
    road: 'h-[4px] w-48',
  },
  xl: {
    wrapper: 'h-32 gap-5',
    icon: 'w-16 h-16',
    text: 'text-lg',
    road: 'h-[5px] w-64',
  },
  '2xl': {
    wrapper: 'h-40 gap-6',
    icon: 'w-20 h-20',
    text: 'text-xl',
    road: 'h-[6px] w-80',
  },
  full: {
    wrapper: 'h-screen gap-8',
    icon: 'w-24 h-24',
    text: 'text-2xl',
    road: 'h-[8px] w-96',
  },
}

const variantMap = {
  primary: {
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    road: 'bg-blue-300 dark:bg-blue-800',
  },
  secondary: {
    icon: 'text-gray-600 dark:text-gray-400',
    text: 'text-gray-700 dark:text-gray-300',
    road: 'bg-gray-300 dark:bg-gray-700',
  },
  default: {
    icon: 'text-primary',
    text: 'text-muted-foreground',
    road: 'bg-muted-foreground/30',
  },
}

export const AdvancedBusLoader = ({ size = 'md', showText = true, text = 'Loading...', variant = 'default', animation = 'drive', className, ...props }: AdvancedBusLoaderProps) => {
  const sizeClasses = sizeMap[size]
  const variantClasses = variantMap[variant]

  const isFullScreen = size === 'full'

  const getAnimationClasses = () => {
    switch (animation) {
      case 'bounce':
        return 'animate-bounce'
      case 'pulse':
        return 'animate-pulse'
      case 'spin':
        return 'animate-spin'
      case 'drive':
        return 'animate-drive'
      default:
        return 'animate-bounce'
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', isFullScreen && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm', sizeClasses.wrapper, className)} {...props}>
      <style>
        {`
          @keyframes drive {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(50%);
            }
          }
          .animate-drive {
            animation: drive 1.5s infinite alternate ease-in-out;
          }
        `}
      </style>

      <div className='relative'>
        <div className={cn('relative', animation === 'drive' ? getAnimationClasses() : '')}>
          <Bus className={cn(animation !== 'drive' ? getAnimationClasses() : '', sizeClasses.icon, variantClasses.icon)} />
        </div>

        {animation === 'drive' && <div className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full', sizeClasses.road, variantClasses.road)} />}
      </div>

      {showText && <p className={cn('animate-pulse font-medium', sizeClasses.text, variantClasses.text)}>{text}</p>}
    </div>
  )
}
