'use client'

import { useState, type ChangeEvent, useEffect } from 'react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/mine/badge'
import { AdvancedBusLoader } from '@/components/mine/loader/advanced-bus-loader'
import { Status } from '@/components/mine/status'
import { genderLabels, statusLabels } from '@/features/students/data/data'
import type { Student } from '@/features/students/data/schema'
import { studentUpdateSchema } from '@/features/students/data/schema'

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
    className: student.className || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(student.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Update local state when student prop changes (e.g., after tab switch)
  useEffect(() => {
    setAvatarPreview(student.avatar || null)
  }, [student.avatar])

  const gradeOptions = ['1', '2', '3', '4', '5']
  const classLetterOptions = ['A', 'B', 'C', 'D']

  const currentGrade = formData.className?.[0] || '1'
  const currentClassLetter = formData.className?.[1] || 'A'

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Remove leading and trailing spaces for text inputs
    const trimmedValue = value.trim()
    setFormData((prev) => ({ ...prev, [name]: trimmedValue }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value as Student['gender'],
    }))
  }

  const handleGradeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      className: value + (prev.className?.[1] ?? 'A'),
    }))
  }

  const handleClassLetterChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      className: (prev.className?.[0] ?? '1') + value,
    }))
  }

  const validateForm = () => {
    try {
      // Create a validation object with the current form data
      const validationData = {
        id: student.id,
        ...formData,
      }

      // Use Zod schema to validate
      studentUpdateSchema.parse(validationData)
      setErrors({})
      return true
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.errors) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSave = async () => {
    // First validate the form
    if (!validateForm()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng kiểm tra lại thông tin nhập vào',
        variant: 'deny',
      })
      return
    }

    try {
      setIsLoading(true)
      const updatedStudent = { ...student, ...formData }
      // console.log('updatedStudent', updatedStudent)
      // await API_SERVICES.students.update(updatedStudent)
      onStudentUpdate(updatedStudent)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin cá nhân',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin cá nhân',
        variant: 'deny',
      })
    } finally {
      setIsLoading(false) // End loading regardless of success or failure
    }
  }

  const handleCancel = () => {
    setFormData({
      name: student.name || '',
      dob: student.dob || '',
      address: student.address || '',
      gender: student.gender || 'MALE',
      className: student.className || '',
    })
    setEditing(false)
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      toast({
        title: 'File không hợp lệ',
        description: 'Vui lòng chọn ảnh hợp lệ (.jpg, .png, ...)',
        variant: 'destructive',
      })
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
      const response = await API_SERVICES.students.updateAvatar(student.id, avatarFile)

      // Get the updated avatar URL from the response
      const updatedAvatarUrl = response?.data?.data?.avatar || student.avatar

      // Update the student object with the new avatar URL
      const updatedStudent = {
        ...student,
        avatar: updatedAvatarUrl,
      }

      // Call the parent's update function to refresh the student data
      onStudentUpdate(updatedStudent)

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
    <>
      {isLoading && <AdvancedBusLoader size='full' variant='primary' animation='drive' text='Đang cập nhật thông tin...' />}
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
              <div className='flex-1 px-4 py-3'>
                {editing ? (
                  <div>
                    <Input name='name' value={formData.name} onChange={handleChange} className={`h-8 ${errors.name ? 'border-red-500' : ''}`} />
                    {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name}</p>}
                  </div>
                ) : (
                  student.name || <Badge color='yellow'>Trống</Badge>
                )}
              </div>
            </div>

            {/* Ngày sinh */}
            <div className='flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Ngày sinh</div>
              <div className='flex-1 px-4 py-3'>{editing ? <Input type='date' name='dob' value={typeof formData.dob === 'string' ? formData.dob : formatDate(formData.dob)} onChange={handleChange} className='h-8' /> : formatDate(student.dob)}</div>
            </div>

            {/* Lớp */}
            <div className='student-row student-class flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Lớp</div>
              <div className='flex-1 px-4 py-3'>
                {editing ? (
                  <div className='flex gap-2'>
                    <Select value={currentGrade} onValueChange={handleGradeChange}>
                      <SelectTrigger className='h-8 w-20'>
                        <SelectValue placeholder='Khối' />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={currentClassLetter} onValueChange={handleClassLetterChange}>
                      <SelectTrigger className='h-8 w-20'>
                        <SelectValue placeholder='Lớp' />
                      </SelectTrigger>
                      <SelectContent>
                        {classLetterOptions.map((letter) => (
                          <SelectItem key={letter} value={letter}>
                            {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  student.className || <Badge color='yellow'>Trống</Badge>
                )}
              </div>
            </div>

            {/* Mã học sinh */}
            <div className='flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mã HS</div>
              <div className='flex-1 px-4 py-3'>{student.rollNumber || <Badge color='yellow'>Trống</Badge>}</div>
            </div>

            {/* Địa chỉ */}
            <div className='flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</div>
              <div className='flex-1 px-4 py-3'>
                {editing ? (
                  <div>
                    <Input name='address' value={formData.address} onChange={handleChange} className={`h-8 ${errors.address ? 'border-red-500' : ''}`} />
                    {errors.address && <p className='mt-1 text-xs text-red-500'>{errors.address}</p>}
                  </div>
                ) : (
                  student.address || <Badge color='yellow'>Trống</Badge>
                )}
              </div>
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
                <Status color={student.status === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[student.status]}</Status>
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
    </>
  )
}
export default StudentsPersonalInfoTab
