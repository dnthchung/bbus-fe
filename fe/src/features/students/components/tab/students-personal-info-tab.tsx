'use client'

import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { Calendar, User, CheckCircle, Mail, MapPin, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/common/select-dropdown'
import { genderLabels, statusLabels } from '../../data/data'
import type { Student } from '../../data/schema'
import type { StudentForm } from '../dialog/students-edit-view-dialog'
import { ParentSelectionTable } from './parent-selection-table'

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
      {/* Personal Info Card - Combined personal and additional info */}
      <div>
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
      </div>

      {/* Parent Info Card */}
      <div>
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
      </div>
    </>
  )

  // Function to render view mode
  const renderViewMode = () => (
    <>
      {/* Personal Info Card - Combined personal and additional info */}
      <div>
        <Card>
          <CardContent className='pt-6'>
            <h4 className='mb-4 text-sm font-semibold'>Thông tin cá nhân</h4>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Left Column - Personal Info */}
              <div>
                <dl className='grid grid-cols-1 gap-4'>
                  <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                      <User className='mr-2 h-4 w-4 text-muted-foreground' /> Họ và tên
                    </dt>
                    <dd className='mt-1 text-base font-medium'>{displayData.name}</dd>
                  </div>
                  <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                      <Calendar className='mr-2 h-4 w-4 text-muted-foreground' /> Ngày sinh
                    </dt>
                    <dd className='mt-1 text-base'>{formatDate(displayData.dob)}</dd>
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
                      <CheckCircle className='mr-2 h-4 w-4 text-muted-foreground' /> Trạng thái
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
      </div>

      {/* Parent Info Card */}
      <div>
        <Card>
          <CardContent className='pt-6'>
            <h4 className='mb-4 text-sm font-semibold'>Thông tin phụ huynh</h4>
            {displayData.parent ? (
              <dl className='grid grid-cols-2 gap-4'>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <User className='mr-2 h-4 w-4 text-muted-foreground' /> Tên phụ huynh
                  </dt>
                  <dd className='mt-1 text-base'>{displayData.parent.name}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <Phone className='mr-2 h-4 w-4 text-muted-foreground' /> Số điện thoại
                  </dt>
                  <dd className='mt-1 text-base'>{displayData.parent.phone}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <Mail className='mr-2 h-4 w-4 text-muted-foreground' /> Email
                  </dt>
                  <dd className='mt-1 text-base'>{displayData.parent.email}</dd>
                </div>
                <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>Giới tính</dt>
                  <dd className='mt-1 text-base'>{genderLabels[displayData.parent.gender as keyof typeof genderLabels]}</dd>
                </div>
                <div className='group col-span-2 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <dt className='flex items-center text-sm font-medium text-muted-foreground'>
                    <MapPin className='mr-2 h-4 w-4 text-muted-foreground' /> Địa chỉ
                  </dt>
                  <dd className='mt-1 text-base'>{displayData.parent.address}</dd>
                </div>
              </dl>
            ) : (
              <div className='group rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'>
                <dt className='text-sm font-medium text-muted-foreground'>Mã phụ huynh</dt>
                <dd className='mt-1 text-base'>{displayData.parentId}</dd>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )

  return <div className='grid gap-6 md:grid-cols-2'>{isEditing ? renderEditForm() : renderViewMode()}</div>
}
