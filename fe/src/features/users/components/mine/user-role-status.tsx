'use client'

import type { UseFormReturn } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectDropdown } from '@/components/common/select-dropdown'

interface UserRoleStatusProps {
  form: UseFormReturn<any>
  isEditing: boolean
  currentUserRole: string | null
  statusLabels: Record<string, string>
}

export function UserRoleStatus({ form, isEditing, currentUserRole, statusLabels }: UserRoleStatusProps) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      {/* Vai trò */}
      <FormField
        control={form.control}
        name='role'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vai trò</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn vai trò' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currentUserRole === 'ADMIN' && (
                  <>
                    <SelectItem value='PARENT'>Phụ huynh</SelectItem>
                    {/* <SelectItem value="TEACHER">Giáo viên</SelectItem> */}
                    <SelectItem value='DRIVER'>Tài xế xe buýt</SelectItem>
                    <SelectItem value='ASSISTANT'>Phụ tá tài xế</SelectItem>
                  </>
                )}
                {currentUserRole === 'SYSADMIN' && (
                  <>
                    <SelectItem value='ADMIN'>Quản lý</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Trạng thái (status) */}
      <FormField
        control={form.control}
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
                  label, // Ví dụ: 'Đang hoạt động', 'Không hoạt động'
                  value: key, // Ví dụ: 'ACTIVE', 'INACTIVE'
                }))}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
