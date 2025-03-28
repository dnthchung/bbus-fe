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
  return (
    <Card>
      <CardContent className='pt-6'>
        <h4 className='mb-4 text-sm font-semibold'>Thông tin đưa đón</h4>

        <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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

          {/* Additional pickup information can be added here when available */}
          <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
            <dt className='text-sm font-medium text-muted-foreground'>Mã điểm đón</dt>
            <dd className='mt-1 text-base'>{displayData.checkpointId || 'Chưa có mã điểm đón'}</dd>
          </div>
        </dl>

        {/* If there's no checkpoint information at all */}
        {!displayData.checkpointId && !displayData.checkpointName && !displayData.checkpointDescription && (
          <div className='mt-4 text-center text-muted-foreground'>
            <p>Chưa có thông tin đưa đón</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
