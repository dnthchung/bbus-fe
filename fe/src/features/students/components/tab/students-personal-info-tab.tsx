'use client'

import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/common/select-dropdown'
import { genderLabels, statusLabels } from '../../data/data'
// Chú ý đường dẫn import chính xác
import { Student } from '../../data/schema'
import { StudentForm } from '../dialog/students-edit-view-dialog'

interface StudentsPersonalInfoTabProps {
  displayData: Student
  isEditing: boolean
  formatDate: (date: Date | string | undefined) => string
}

/**
 * Tab "Thông tin cá nhân"
 */
export function StudentsPersonalInfoTab({ displayData, isEditing, formatDate }: StudentsPersonalInfoTabProps) {
  const { control } = useFormContext<StudentForm>()

  // Hàm helper render Badge hiển thị trạng thái
  const renderStatusBadge = (status: string) => {
    const variant = status === 'ACTIVE' ? 'default' : 'outline'
    return <Badge variant={variant}>{statusLabels[status as keyof typeof statusLabels] ?? status}</Badge>
  }

  if (isEditing) {
    return (
      <>
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
      </>
    )
  }

  // Nếu không phải chế độ edit, hiển thị dạng read-only
  return (
    <div className='grid grid-cols-1 gap-4'>
      <Card>
        <CardContent className='pt-6'>
          <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Họ và tên</dt>
              <dd className='text-base'>{displayData.name}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Mã học sinh</dt>
              <dd className='text-base'>{displayData.rollNumber}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Ngày sinh</dt>
              <dd className='text-base'>{formatDate(displayData.dob)}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Giới tính</dt>
              <dd className='text-base'>{genderLabels[displayData.gender as keyof typeof genderLabels]}</dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-muted-foreground'>Địa chỉ</dt>
              <dd className='text-base'>{displayData.address}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-muted-foreground'>Trạng thái</dt>
              <dd className='mt-1 flex items-center text-base'>{renderStatusBadge(displayData.status)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
