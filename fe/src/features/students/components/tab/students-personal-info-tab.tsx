'use client'

//path : fe/src/features/students/components/tab/students-personal-info-tab.tsx
import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { Calendar, User, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/common/select-dropdown'
import { genderLabels, statusLabels } from '../../data/data'
import type { Student } from '../../data/schema'
import type { StudentForm } from '../page/students-edit-view-page'

interface StudentsPersonalInfoTabProps {
  displayData: Student
  isEditing: boolean
  formatDate: (date: Date | string | undefined) => string
}

export function StudentsPersonalInfoTab({ displayData, isEditing, formatDate }: StudentsPersonalInfoTabProps) {
  const { control } = useFormContext<StudentForm>()

  // Function to render edit form fields
  const renderEditForm = () => (
    <>
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-4 text-sm font-semibold'>Thông tin cá nhân</h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Left Column - Personal Info fields */}
            <div className='space-y-4'>
              {/* Họ và tên */}
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Văn A' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Ngày sinh */}
              <FormField
                control={control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type='date' value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Địa chỉ */}
              <FormField
                control={control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập địa chỉ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Right Column - Additional Info fields */}
            <div className='space-y-4'>
              {/* Giới tính */}
              <FormField
                control={control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Chọn giới tính'
                        items={Object.entries(genderLabels).map(([key, label]) => ({
                          label,
                          value: key,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Trạng thái */}
              <FormField
                control={control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Chọn trạng thái'
                        items={Object.entries(statusLabels).map(([key, label]) => ({
                          label,
                          value: key,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  // Function to render view mode
  const renderViewMode = () => (
    <>
      <Card>
        <CardContent className='pt-6'>
          <h4 className='mb-4 text-sm font-semibold'>Thông tin cá nhân</h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Left Column - Personal Info */}
            <div>
              <dl className='grid grid-cols-1 gap-4'>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <User className='mr-2 h-4 w-4 text-muted-foreground' />
                    Họ và tên
                  </dt>
                  <dd className='mt-1 text-base font-medium'>{displayData.name}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                    Ngày sinh
                  </dt>
                  <dd className='mt-1 text-base'>{formatDate(displayData.dob)}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>Địa chỉ</dt>
                  <dd className='mt-1 text-base'>{displayData.address}</dd>
                </div>
              </dl>
            </div>
            {/* Right Column - Additional Info */}
            <div>
              <dl className='grid grid-cols-1 gap-4'>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>Giới tính</dt>
                  <dd className='mt-1 text-base'>{genderLabels[displayData.gender as keyof typeof genderLabels]}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <CheckCircle className='mr-2 h-4 w-4 text-muted-foreground' />
                    Trạng thái
                  </dt>
                  <dd className='mt-1'>
                    {displayData.status === 'ACTIVE' ? (
                      <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>Đang sử dụng</Badge>
                    ) : (
                      <Badge variant='outline' className='text-gray-600'>
                        Không hoạt động
                      </Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return <div>{isEditing ? renderEditForm() : renderViewMode()}</div>
}
