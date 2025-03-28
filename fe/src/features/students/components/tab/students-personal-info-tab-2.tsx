'use client'

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

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {/* Column 1: Personal Information */}
      <div>
        <Card>
          <CardContent className='pt-6'>
            <h4 className='mb-4 text-sm font-semibold'>Thông tin cá nhân</h4>

            {isEditing ? (
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
            ) : (
              // View mode
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Column 2: Parent Information */}
      <div>
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
              <dl className='grid grid-cols-1 gap-3'>
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
                    <div>
                      <dt className='text-sm font-medium text-muted-foreground'>Địa chỉ</dt>
                      <dd className='text-base'>{displayData.parent.address}</dd>
                    </div>
                  </>
                ) : (
                  <div>
                    <dt className='text-sm font-medium text-muted-foreground'>Mã phụ huynh</dt>
                    <dd className='text-base'>{displayData.parentId}</dd>
                  </div>
                )}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
