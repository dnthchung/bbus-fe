'use client'

//path : fe/src/features/students/components/tab/students-pickup-info-tab.tsx
import { Card, CardContent } from '@/components/ui/card'
import type { Student } from '../../data/schema'

interface StudentsPickupInfoTabProps {
  displayData: Student
  isEditing: boolean
}

/**
 * Tab "Thông tin đưa đón"
 */
export function StudentsPickupInfoTab({ displayData, isEditing }: StudentsPickupInfoTabProps) {
  const hasPickupInfo = displayData.checkpointId || displayData.checkpointName || displayData.checkpointDescription

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {/* Left: Pickup Info */}
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-4 text-sm font-semibold'>Thông tin đưa đón</h4>
          {hasPickupInfo ? (
            <dl className='space-y-4'>
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='text-sm font-medium text-muted-foreground'>Điểm đón</dt>
                <dd className='mt-1 text-base'>{displayData.checkpointName || 'Chưa có điểm đón'}</dd>
              </div>

              {displayData.checkpointDescription && (
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='text-sm font-medium text-muted-foreground'>Mô tả điểm đón</dt>
                  <dd className='mt-1 text-base'>{displayData.checkpointDescription}</dd>
                </div>
              )}

              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='text-sm font-medium text-muted-foreground'>Mã điểm đón</dt>
                <dd className='mt-1 text-base'>{displayData.checkpointId || 'Chưa có mã điểm đón'}</dd>
              </div>
            </dl>
          ) : (
            <div className='text-center text-muted-foreground'>
              <p>Chưa có thông tin đưa đón</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right: Map Placeholder */}
      <div className='rounded-md border border-dashed border-gray-300 p-4 text-center text-muted-foreground dark:border-gray-700'>
        <p>Hiển thị bản đồ vị trí điểm đón tại đây (đang phát triển)</p>
      </div>
    </div>
  )
}
