'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/mine/badge'
import type { Student } from '../../data/schema'
import { ParentSelectionTable } from './parent-selection-table'

interface StudentsParentInfoTabProps {
  student: Student
  onStudentUpdate: (updatedStudent: Student) => void
}

export function StudentsParentInfoTab({ student, onStudentUpdate }: StudentsParentInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState(student.parentId || '')

  const handleParentSelect = (parentId: string) => {
    setSelectedParentId(parentId)
  }

  const handleSave = async () => {
    try {
      const updatedStudent = { ...student, parentId: selectedParentId }
      onStudentUpdate(updatedStudent)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin phụ huynh',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin phụ huynh',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setSelectedParentId(student.parentId || '')
    setEditing(false)
  }

  return (
    <div className='mt-5 space-y-1'>
      <div className='mb-4 flex w-1/2 items-center justify-between'>
        <h3 className='text-lg font-medium'>Thông tin phụ huynh</h3>
        {editing ? (
          <div className='space-x-2'>
            <Button variant='outline' size='sm' onClick={handleCancel}>
              Hủy
            </Button>
            <Button size='sm' onClick={handleSave}>
              Lưu
            </Button>
          </div>
        ) : (
          <Button variant='outline' size='sm' onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      {editing ? (
        <div className='w-1/2 rounded-md border p-4'>
          <ParentSelectionTable initialParentId={student.parentId} onParentSelect={handleParentSelect} />
        </div>
      ) : (
        <div className='w-1/2 overflow-hidden rounded-md border text-sm'>
          {/* Tên phụ huynh */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Tên phụ huynh</div>
            <div className='flex-1 px-4 py-3'>{student.parent?.name || <Badge color='yellow'>Chưa có</Badge>}</div>
          </div>

          {/* Email */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Email</div>
            <div className='flex-1 px-4 py-3'>{student.parent?.email || <Badge color='yellow'>Không có</Badge>}</div>
          </div>

          {/* Số điện thoại */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Số điện thoại</div>
            <div className='flex-1 px-4 py-3'>{student.parent?.phone || <Badge color='yellow'>Chưa có</Badge>}</div>
          </div>

          {/* Địa chỉ */}
          <div className='flex'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</div>
            <div className='flex-1 px-4 py-3'>{student.parent?.address || <Badge color='yellow'>Không có</Badge>}</div>
          </div>
        </div>
      )}
    </div>
  )
}
