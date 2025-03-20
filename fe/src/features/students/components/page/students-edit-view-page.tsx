'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { API_SERVICES } from '@/api/api-services'
import { Button } from '@/components/ui/button'
import { statusLabels, genderLabels } from '../../data/data'
import { Student } from '../../data/schema'

interface StudentsEditViewPageProps {
  studentId: string
}

export default function StudentsEditViewPage({ studentId }: StudentsEditViewPageProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudent() {
      try {
        setLoading(true)
        // Gọi API lấy thông tin chi tiết học sinh theo studentId
        const response = await API_SERVICES.students.getOne(studentId)
        // Giả sử API trả về dữ liệu ở response.data theo cấu trúc của studentSchema
        setStudent(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching student details:', err)
        setError('Có lỗi xảy ra khi tải thông tin học sinh.')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [studentId])

  if (loading) return <p className='p-4'>Đang tải thông tin học sinh...</p>
  if (error) return <p className='p-4 text-red-500'>{error}</p>
  if (!student) return <p className='p-4'>Không tìm thấy thông tin học sinh.</p>

  return (
    <div className='p-6'>
      <h1 className='mb-6 text-3xl font-bold'>Chi tiết Học sinh</h1>
      <div className='flex flex-col gap-8 md:flex-row'>
        {/* Cột bên trái: Thông tin Học sinh */}
        <div className='flex-1 rounded border p-4 shadow-sm'>
          <h2 className='mb-4 text-2xl font-semibold'>Thông tin Học sinh</h2>
          <div className='mb-2'>
            <strong>Roll Number:</strong> {student.rollNumber}
          </div>
          <div className='mb-2'>
            <strong>Họ và tên:</strong> {student.name}
          </div>
          <div className='mb-2 flex items-center'>
            <strong>Avatar:</strong>
            <img src={student.avatar} alt='Avatar học sinh' className='ml-2 h-16 w-16 rounded-full' />
          </div>
          <div className='mb-2'>
            <strong>Ngày sinh:</strong> {format(new Date(student.dob), 'dd/MM/yyyy')}
          </div>
          <div className='mb-2'>
            <strong>Địa chỉ:</strong> {student.address}
          </div>
          <div className='mb-2'>
            <strong>Giới tính:</strong> {genderLabels[student.gender] || student.gender}
          </div>
          <div className='mb-2'>
            <strong>Trạng thái:</strong> {statusLabels[student.status] || student.status}
          </div>
          <div className='mb-2'>
            <strong>Checkpoint:</strong> {student.checkpointName}
          </div>
          <div className='mb-2'>
            <strong>Mô tả Checkpoint:</strong> {student.checkpointDescription}
          </div>
        </div>

        {/* Cột bên phải: Thông tin Phụ huynh */}
        <div className='flex-1 rounded border p-4 shadow-sm'>
          <h2 className='mb-4 text-2xl font-semibold'>Thông tin Phụ huynh</h2>
          {student.parent ? (
            <>
              <div className='mb-2'>
                <strong>Tên phụ huynh:</strong> {student.parent.name}
              </div>
              <div className='mb-2'>
                <strong>Username:</strong> {student.parent.username}
              </div>
              <div className='mb-2'>
                <strong>Email:</strong> {student.parent.email}
              </div>
              <div className='mb-2'>
                <strong>Số điện thoại:</strong> {student.parent.phone}
              </div>
              <div className='mb-2'>
                <strong>Địa chỉ:</strong> {student.parent.address}
              </div>
              <div className='mb-2'>
                <strong>Giới tính:</strong> {student.parent.gender}
              </div>
              <div className='mb-2 flex items-center'>
                <strong>Avatar:</strong>
                <img src={student.parent.avatar} alt='Avatar phụ huynh' className='ml-2 h-16 w-16 rounded-full' />
              </div>
              <div className='mb-2'>
                <strong>Trạng thái:</strong> {student.parent.status}
              </div>
            </>
          ) : (
            <p>Không có thông tin phụ huynh.</p>
          )}
        </div>
      </div>
      {/* Bạn có thể thêm các nút hành động (sửa, lưu,...) nếu cần */}
      <div className='mt-6'>
        <Button onClick={() => console.log('Chức năng chỉnh sửa được kích hoạt')}>Chỉnh sửa thông tin</Button>
      </div>
    </div>
  )
}
