import React, { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconEye } from '@tabler/icons-react'
import { Eye, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/mine/badge'
import { Status } from '@/components/mine/status'
import { getStudentsByBusId } from '@/features/buses/buses'
import { statusLabels } from '@/features/buses/data'
import type { Bus } from '@/features/buses/schema'

// Định nghĩa interface
interface Parent {
  userId: string
  username: string
  name: string
  gender: string
  dob: string
  email: string
  avatar: string
  phone: string
  address: string
  status: string
  role: string
}

interface Student {
  id: string
  rollNumber: string
  name: string
  avatar: string
  dob: string
  address: string
  gender: string
  status: string
  parentId: string
  busId: string
  busName: string
  parent: Parent
  checkpointId: string
  checkpointName: string
  checkpointDescription: string
}

interface BasicInfoTabProps {
  bus: Bus
  onBusUpdate: (updatedBus: Bus) => void
}

// Hàm tiện ích rút gọn tên (tối đa 3 từ)
function truncateName(fullName: string, maxWords = 3) {
  const trimmed = fullName.trim()
  const words = trimmed.split(/\s+/)
  if (words.length <= maxWords) {
    return trimmed
  }
  return words.slice(0, maxWords).join(' ') + '...'
}

export function BasicInfoTab({ bus, onBusUpdate }: BasicInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: bus.name || '',
    licensePlate: bus.licensePlate || '',
    routeCode: bus.routeCode || '',
    busStatus: bus.busStatus,
    amountOfStudents: bus.amountOfStudents,
  })

  // Danh sách học sinh
  const [studentList, setStudentList] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [studentError, setStudentError] = useState<Error | null>(null)

  // Phần tìm kiếm & phân trang
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 5

  // Lấy danh sách học sinh
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true)
        const students = await getStudentsByBusId(bus.id)
        setStudentList(students)
        setStudentError(null)
      } catch (err) {
        console.error('Error fetching student list:', err)
        setStudentError(err instanceof Error ? err : new Error('Không thể tải danh sách học sinh'))
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [bus.id])

  // Xử lý thay đổi input ở phần chỉnh sửa thông tin
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amountOfStudents' ? Number.parseInt(value) || 0 : value,
    }))
  }

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      busStatus: value as 'ACTIVE' | 'INACTIVE',
    }))
  }

  // Lưu thông tin
  const handleSave = async () => {
    try {
      // Gọi API cập nhật bus nếu cần
      const updatedBus = {
        ...bus,
        ...formData,
      }
      onBusUpdate(updatedBus)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin cơ bản',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin cơ bản',
        variant: 'destructive',
      })
    }
  }

  // Hủy thay đổi
  const handleCancel = () => {
    setFormData({
      name: bus.name || '',
      licensePlate: bus.licensePlate || '',
      routeCode: bus.routeCode || '',
      busStatus: bus.busStatus,
      amountOfStudents: bus.amountOfStudents,
    })
    setEditing(false)
  }

  // Lọc student theo tên (searchTerm)
  const filteredStudents = studentList.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE)

  // Lấy dữ liệu trang hiện tại
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentStudents = filteredStudents.slice(startIndex, startIndex + PAGE_SIZE)

  // Xử lý nút chuyển trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <TooltipProvider>
      <div className='flex flex-col gap-3 md:flex-row'>
        {/* Basic Info Section */}
        <div className='w-full space-y-1 md:w-1/2'>
          {/* Header & Action Buttons */}
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Thông tin cơ bản</h3>
            {editing ? (
              <div className='flex space-x-2'>
                <Button variant='outline' onClick={handleCancel}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Lưu</Button>
              </div>
            ) : (
              <Button variant='secondary' onClick={() => setEditing(true)}>
                Chỉnh sửa
              </Button>
            )}
          </div>

          {/* Table-like structure */}
          <div className='overflow-hidden rounded-md border'>
            <div className='text-sm'>
              {/* Tên xe buýt */}
              <div className='flex border-b'>
                <div className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Tên xe buýt</div>
                <div className='flex-1 px-4 py-3'>{editing ? <Input name='name' value={formData.name} onChange={handleChange} placeholder='Nhập tên xe buýt' className='h-8' /> : bus.name || 'Chưa có tên'}</div>
              </div>

              {/* Biển số xe */}
              <div className='flex border-b'>
                <div className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Biển số xe</div>
                <div className='flex-1 px-4 py-3'>{editing ? <Input name='licensePlate' value={formData.licensePlate} onChange={handleChange} placeholder='Nhập biển số xe' className='h-8' /> : bus.licensePlate ? bus.licensePlate : <Badge color='yellow'>Trống</Badge>}</div>
              </div>

              {/* Mã tuyến */}
              <div className='flex border-b'>
                <div className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Mã tuyến</div>
                <div className='flex-1 px-4 py-3'>{editing ? <Input name='routeCode' value={formData.routeCode} onChange={handleChange} placeholder='Nhập mã tuyến' className='h-8' /> : bus.routeCode ? bus.routeCode : <Badge color='yellow'>Trống</Badge>}</div>
              </div>

              {/* Trạng thái */}
              <div className='flex border-b'>
                <div className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Trạng thái</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <Select value={formData.busStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger className='h-8 w-full'>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ACTIVE'>{statusLabels.ACTIVE}</SelectItem>
                        <SelectItem value='INACTIVE'>{statusLabels.INACTIVE}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Status color={bus.busStatus === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[bus.busStatus] || bus.busStatus}</Status>
                  )}
                </div>
              </div>

              {/* Số học sinh */}
              <div className='flex'>
                <div className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Số học sinh</div>
                <div className='flex-1 px-4 py-3'>{editing ? <Input type='number' name='amountOfStudents' value={formData.amountOfStudents} onChange={handleChange} placeholder='Nhập số học sinh' className='h-8' /> : bus.amountOfStudents}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Student List Section */}
        <div className='w-full py-1 md:w-1/2'>
          <div className='mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between'>
            <h3 className='text-lg font-medium'>Danh sách học sinh đăng ký xe</h3>
            {/* Ô input để search */}
            <Input
              type='text'
              placeholder='Tìm theo tên học sinh...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // reset về page 1 khi search
              }}
              className='h-8 w-full sm:w-1/2'
            />
          </div>

          {loadingStudents ? (
            <div className='flex items-center justify-center rounded-md border py-10'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : studentError ? (
            <div className='rounded-md border py-6 text-center text-destructive'>
              <p>{studentError.message}</p>
            </div>
          ) : (
            <>
              <div className='overflow-hidden rounded-md border'>
                <table className='w-full text-sm'>
                  <thead className='bg-muted/50'>
                    <tr>
                      <th className='px-4 py-2 text-left font-medium'>Mã số</th>
                      <th className='px-4 py-2 text-left font-medium'>Tên</th>
                      <th className='px-4 py-2 text-left font-medium'>Giới tính</th>
                      <th className='px-4 py-2 text-left font-medium'>Tên phụ huynh</th>
                      {/* Cột mới: Chi tiết */}
                      <th className='px-4 py-2 text-left font-medium'>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => {
                        const truncatedStudentName = truncateName(student.name, 3)
                        const truncatedParentName = truncateName(student.parent?.name || '', 3)
                        return (
                          <tr key={student.id} className='border-t'>
                            <td className='px-4 py-2'>{student.rollNumber}</td>
                            <td className='px-4 py-2'>
                              <Tooltip>
                                <TooltipTrigger>{truncatedStudentName}</TooltipTrigger>
                                <TooltipContent>{student.name}</TooltipContent>
                              </Tooltip>
                            </td>
                            <td className='px-4 py-2'>{student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : student.gender}</td>
                            <td className='px-4 py-2'>
                              {student.parent ? (
                                <Tooltip>
                                  <TooltipTrigger>{truncatedParentName}</TooltipTrigger>
                                  <TooltipContent>{student.parent.name}</TooltipContent>
                                </Tooltip>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            {/* Ô chi tiết (icon con mắt) */}
                            <td className='px-4 py-2'>
                              <Link to={`/students/details/${student.id}`}>
                                <div className='flex h-7 w-7 items-center justify-center rounded-md bg-muted/50 hover:bg-muted'>
                                  <IconEye size={18} className='cursor-pointer text-muted-foreground' />
                                </div>
                              </Link>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className='px-4 py-6 text-center'>
                          Không tìm thấy học sinh nào cho xe buýt này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Thanh điều hướng trang */}
              {filteredStudents.length > PAGE_SIZE && (
                <div className='mt-3 flex items-center justify-center space-x-2'>
                  <Button variant='outline' onClick={handlePrevPage} disabled={currentPage === 1}>
                    Trang trước
                  </Button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button variant='outline' onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Trang sau
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
