// src/features/dashboard/components/common/dashboard-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className='space-y-4'>
      {/* KPI Cards Skeleton */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-[100px] w-full rounded-md' />
        ))}
      </div>

      {/* Chart + Reports Skeleton */}
      <div className='grid gap-4 lg:grid-cols-3'>
        {/* Chart skeleton */}
        <Skeleton className='col-span-2 h-[250px] w-full rounded-md' />
        {/* Report download section */}
        <Skeleton className='h-[250px] w-full rounded-md' />
      </div>
    </div>
  )
}
