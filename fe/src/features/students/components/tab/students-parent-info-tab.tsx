'use client'

import { useFormContext } from 'react-hook-form'
import { User, Mail, MapPin, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { genderLabels } from '../../data/data'
import type { Student } from '../../data/schema'
import type { StudentForm } from '../page/students-edit-view-page'
import { ParentSelectionTable } from './parent-selection-table'

interface StudentsParentInfoTabProps {
  displayData: Student
  isEditing: boolean
}

export function StudentsParentInfoTab({ displayData, isEditing }: StudentsParentInfoTabProps) {
  const { control } = useFormContext<StudentForm>()

  // Function to render edit form fields
  const renderEditForm = () => (
    <>
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-4 text-sm font-semibold'>Thông tin phụ huynh</h4>
          <FormField
            control={control}
            name='parentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phụ huynh</FormLabel>
                <FormControl>
                  <ParentSelectionTable />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )

  // Function to render view mode
  const renderViewMode = () => (
    <>
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-4 text-sm font-semibold'>Thông tin phụ huynh</h4>
          {displayData.parent ? (
            <dl className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                  <User className='mr-2 h-4 w-4 text-muted-foreground' />
                  Tên phụ huynh
                </dt>
                <dd className='mt-1 text-base'>{displayData.parent.name}</dd>
              </div>
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                  <Phone className='mr-2 h-4 w-4 text-muted-foreground' />
                  Số điện thoại
                </dt>
                <dd className='mt-1 text-base'>{displayData.parent.phone}</dd>
              </div>
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                  <Mail className='mr-2 h-4 w-4 text-muted-foreground' />
                  Email
                </dt>
                <dd className='mt-1 text-base'>{displayData.parent.email}</dd>
              </div>
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='flex items-center text-sm font-medium text-muted-foreground'>Giới tính</dt>
                <dd className='mt-1 text-base'>{genderLabels[displayData.parent.gender as keyof typeof genderLabels]}</dd>
              </div>
              <div className='group col-span-2 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                  <MapPin className='mr-2 h-4 w-4 text-muted-foreground' />
                  Địa chỉ
                </dt>
                <dd className='mt-1 text-base'>{displayData.parent.address}</dd>
              </div>
            </dl>
          ) : (
            <div className='rounded-md p-4 text-center'>
              <p className='text-muted-foreground'>Chưa có thông tin phụ huynh</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )

  return <div>{isEditing ? renderEditForm() : renderViewMode()}</div>
}
