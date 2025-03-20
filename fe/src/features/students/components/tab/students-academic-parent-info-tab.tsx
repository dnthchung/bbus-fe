'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { genderLabels } from '../../data/data'
import { Student } from '../../data/schema'
import { StudentForm } from '../dialog/students-edit-view-dialog'

interface StudentsAcademicParentInfoTabProps {
  displayData: Student
  isEditing: boolean
}

/**
 * Tab "Học tập & Phụ huynh"
 */
export function StudentsAcademicParentInfoTab({ displayData, isEditing }: StudentsAcademicParentInfoTabProps) {
  const { control } = useFormContext<StudentForm>()

  return (
    <>
      {/* Thông tin học tập */}
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-2 text-sm font-semibold'>Thông tin học tập</h4>
          <dl className='grid grid-cols-1 gap-3'>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Lớp/Cấp học</dt>
              <dd className='text-base'>{displayData.checkpointName || 'Chưa phân lớp'}</dd>
            </div>
            {displayData.checkpointDescription && (
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Mô tả</dt>
                <dd className='text-base'>{displayData.checkpointDescription}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Thông tin phụ huynh */}
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-2 text-sm font-semibold'>Thông tin phụ huynh</h4>
          {isEditing ? (
            <FormField
              control={control}
              name='parentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phụ huynh</FormLabel>
                  <FormControl>
                    <Input placeholder='Chọn phụ huynh (UUID)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {displayData.parent ? (
                <>
                  <div>
                    <dt className='text-sm font-medium text-muted-foreground'>Tên phụ huynh</dt>
                    <dd className='text-base'>{displayData.parent.name}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-muted-foreground'>Số điện thoại</dt>
                    <dd className='text-base'>{displayData.parent.phone}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-muted-foreground'>Email</dt>
                    <dd className='text-base'>{displayData.parent.email}</dd>
                  </div>
                  <div>
                    <dt className='text-sm font-medium text-muted-foreground'>Giới tính</dt>
                    <dd className='text-base'>{genderLabels[displayData.parent.gender as keyof typeof genderLabels]}</dd>
                  </div>
                  <div className='sm:col-span-2'>
                    <dt className='text-sm font-medium text-muted-foreground'>Địa chỉ</dt>
                    <dd className='text-base'>{displayData.parent.address}</dd>
                  </div>
                </>
              ) : (
                <div className='sm:col-span-2'>
                  <dt className='text-sm font-medium text-muted-foreground'>Mã phụ huynh</dt>
                  <dd className='text-base'>{displayData.parentId}</dd>
                </div>
              )}
            </dl>
          )}
        </CardContent>
      </Card>
    </>
  )
}
