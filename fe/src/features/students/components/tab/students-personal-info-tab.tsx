'use client'

import { useState, ChangeEvent } from 'react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/mine/badge'
import { Status } from '@/components/mine/status'
import { genderLabels, statusLabels } from '../../data/data'
import type { Student } from '../../data/schema'

interface StudentsPersonalInfoTabProps {
  student: Student
  onStudentUpdate: (updatedStudent: Student) => void
  formatDate: (date: Date | string | undefined) => string
}

export function StudentsPersonalInfoTab({ student, onStudentUpdate, formatDate }: StudentsPersonalInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: student.name || '',
    dob: student.dob || '',
    address: student.address || '',
    gender: student.gender || 'MALE',
    status: student.status || 'ACTIVE',
    rollNumber: student.rollNumber || '',
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(student.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value as Student['gender'] }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as Student['status'] }))
  }

  const handleSave = async () => {
    try {
      const updatedStudent = { ...student, ...formData }
      onStudentUpdate(updatedStudent)
      toast({ title: 'Thành công', description: 'Đã cập nhật thông tin cá nhân', variant: 'success' })
      setEditing(false)
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật thông tin cá nhân', variant: 'destructive' })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: student.name || '',
      dob: student.dob || '',
      address: student.address || '',
      gender: student.gender || 'MALE',
      status: student.status || 'ACTIVE',
      rollNumber: student.rollNumber || '',
    })
    setEditing(false)
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      toast({ title: 'File không hợp lệ', description: 'Vui lòng chọn ảnh hợp lệ (.jpg, .png, ...)', variant: 'destructive' })
    }
  }

  const handleAvatarCancel = () => {
    setAvatarFile(null)
    setAvatarPreview(student.avatar || null)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    try {
      setUploadingAvatar(true)

      // Pass the student ID and the avatar file directly to the API service
      await API_SERVICES.students.updateAvatar(student.id, avatarFile)

      toast({
        title: 'Thành công',
        description: 'Ảnh đại diện đã được cập nhật',
        variant: 'success',
      })

      setAvatarFile(null)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật ảnh đại diện',
        variant: 'destructive',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-3'>
      {/* LEFT: Thông tin cá nhân */}
      <div className='space-y-1 md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Thông tin cá nhân</h3>
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

        <div className='overflow-hidden rounded-md border text-sm'>
          {/* Họ và tên */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Họ và tên</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='name' value={formData.name} onChange={handleChange} className='h-8' /> : student.name || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Ngày sinh */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Ngày sinh</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input type='date' name='dob' value={typeof formData.dob === 'string' ? formData.dob : formatDate(formData.dob)} onChange={handleChange} className='h-8' /> : formatDate(student.dob)}</div>
          </div>

          {/* Mã học sinh */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mã học sinh</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='rollNumber' value={formData.rollNumber} onChange={handleChange} className='h-8' /> : student.rollNumber || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Địa chỉ */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='address' value={formData.address} onChange={handleChange} className='h-8' /> : student.address || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Giới tính */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Giới tính</div>
            <div className='flex-1 px-4 py-3'>
              {editing ? (
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger className='h-8 w-full'>
                    <SelectValue placeholder='Chọn giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(genderLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                genderLabels[student.gender] || <Badge color='yellow'>Không rõ</Badge>
              )}
            </div>
          </div>

          {/* Trạng thái */}
          <div className='flex'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Trạng thái</div>
            <div className='flex-1 px-4 py-3'>
              {editing ? (
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className='h-8 w-full'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Status color={student.status === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[student.status]}</Status>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Avatar upload */}
      <div className='space-y-4'>
        <h3 className='p-1 text-center text-base font-medium'>Ảnh đại diện</h3>
        <div className='rounded-md border p-3 text-center'>
          <img src={avatarPreview || '/placeholder-avatar.png'} alt='Avatar' className='mx-auto mb-3 h-28 w-28 rounded-full border object-cover' />
          <Input type='file' accept='image/*' onChange={handleAvatarChange} />
          {avatarFile && (
            <div className='mt-3 flex justify-center gap-2'>
              <Button size='sm' onClick={handleAvatarUpload} disabled={uploadingAvatar}>
                {uploadingAvatar ? 'Đang tải...' : 'Xác nhận'}
              </Button>
              <Button size='sm' variant='outline' onClick={handleAvatarCancel}>
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
