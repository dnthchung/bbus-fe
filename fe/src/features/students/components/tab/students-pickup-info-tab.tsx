'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/mine/badge'
import type { Student } from '../../data/schema'

interface StudentsPickupInfoTabProps {
  student: Student
  onStudentUpdate: (updatedStudent: Student) => void
}

export function StudentsPickupInfoTab({ student, onStudentUpdate }: StudentsPickupInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    checkpointId: student.checkpointId || '',
    checkpointName: student.checkpointName || '',
    checkpointDescription: student.checkpointDescription || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const updatedStudent = { ...student, ...formData }
      onStudentUpdate(updatedStudent)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin đưa đón',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin đưa đón',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      checkpointId: student.checkpointId || '',
      checkpointName: student.checkpointName || '',
      checkpointDescription: student.checkpointDescription || '',
    })
    setEditing(false)
  }

  return (
    <div className='mt-5 space-y-1'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Thông tin đưa đón</h3>
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
          <Button variant='outline' size='sm' onClick={() => setEditing(true)} disabled>
            Chỉnh sửa
          </Button>
        )}
      </div>

      <div className='overflow-hidden rounded-md border text-sm'>
        {/* Điểm đón */}
        <div className='flex border-b'>
          <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Điểm đón</div>
          <div className='flex-1 px-4 py-3'>{editing ? <Input name='checkpointName' value={formData.checkpointName} onChange={handleChange} placeholder='Nhập tên điểm đón' className='h-8' /> : student.checkpointName || <Badge color='yellow'>Trống</Badge>}</div>
        </div>

        {/* Mô tả điểm đón */}
        <div className='flex border-b'>
          <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mô tả điểm đón</div>
          <div className='flex-1 px-4 py-3'>{editing ? <Input name='checkpointDescription' value={formData.checkpointDescription} onChange={handleChange} placeholder='Nhập mô tả' className='h-8' /> : student.checkpointDescription || <Badge color='yellow'>Trống</Badge>}</div>
        </div>

        {/* Mã điểm đón */}
        <div className='flex'>
          <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mã điểm đón</div>
          <div className='flex-1 px-4 py-3'>{editing ? <Input name='checkpointId' value={formData.checkpointId} onChange={handleChange} placeholder='Nhập mã điểm đón' className='h-8' /> : student.checkpointId || <Badge color='yellow'>Trống</Badge>}</div>
        </div>
      </div>
    </div>
  )
}
