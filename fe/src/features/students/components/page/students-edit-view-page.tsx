'use client'

//path : fe/src/features/students/components/page/students-edit-view-page.tsx
import { useEffect, useState } from 'react'
import { Route } from '@/routes/_authenticated/students/details/$id'
import { ChevronLeft } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import type { Student } from '../../data/schema'
import { StudentsParentInfoTab } from '../tab/students-parent-info-tab'
import { StudentsPersonalInfoTab } from '../tab/students-personal-info-tab'
import { StudentsPickupInfoTab } from '../tab/students-pickup-info-tab'

export default function StudentsDetailsContent() {
  const { id } = Route.useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await API_SERVICES.students.getOne(id)
        setStudent(response.data.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching student details:', err)
        setError(err instanceof Error ? err : new Error('Không thể tải thông tin học sinh'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleBack = () => {
    window.history.back()
  }

  const handleStudentUpdate = (updatedStudent: Student) => {
    setStudent(updatedStudent)
    // Here you would typically call an API to update the student in the backend
  }

  const handleStatusUpdate = async () => {
    if (!student || !id) return
    try {
      setUpdatingStatus(true)
      const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

      // Call API to update status
      await API_SERVICES.students.updateStatus(id, newStatus)

      // Update local state
      setStudent({
        ...student,
        status: newStatus,
      })

      toast({
        title: 'Thành công',
        description: newStatus === 'ACTIVE' ? 'Học sinh đã được kích hoạt' : 'Học sinh đã bị vô hiệu hóa',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating student status:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái học sinh',
        variant: 'destructive',
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A'
    return date instanceof Date ? date.toLocaleDateString('vi-VN') : new Date(date).toLocaleDateString('vi-VN')
  }

  return (
    <>
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Học sinh</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/students'>Danh sách học sinh</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{loading ? 'Chi tiết học sinh' : student ? `${student.name}` : 'Không tìm thấy'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <Button variant='outline' size='sm' onClick={handleBack}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>

        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Thông tin chi tiết học sinh</h1>
          <p className='text-muted-foreground'>Xem và quản lý thông tin chi tiết của học sinh.</p>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-10'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className='py-10 text-center'>
              <div className='text-destructive'>
                <p className='text-lg font-semibold'>Đã xảy ra lỗi</p>
                <p>{error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : !student ? (
          <Card>
            <CardContent className='py-10 text-center'>
              <p className='text-lg font-semibold'>Không tìm thấy thông tin học sinh</p>
              <Button variant='outline' className='mt-4' onClick={handleBack}>
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue='personal' className='mb-6'>
              <TabsList className='grid w-1/2 grid-cols-3'>
                <TabsTrigger value='personal'>Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value='parent'>Thông tin phụ huynh</TabsTrigger>
                <TabsTrigger value='pickup'>Thông tin đưa đón</TabsTrigger>
              </TabsList>

              <TabsContent className='w-1/2' value='personal'>
                <StudentsPersonalInfoTab student={student} onStudentUpdate={handleStudentUpdate} formatDate={formatDate} />
              </TabsContent>

              <TabsContent value='parent'>
                <StudentsParentInfoTab student={student} onStudentUpdate={handleStudentUpdate} />
              </TabsContent>

              <TabsContent className='w-1/2' value='pickup'>
                <StudentsPickupInfoTab student={student} onStudentUpdate={handleStudentUpdate} />
              </TabsContent>
            </Tabs>

            <div className='border-t pt-4'>
              {student.status === 'ACTIVE' ? (
                <Button variant='destructive' onClick={handleStatusUpdate} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : 'Vô hiệu hóa'}
                </Button>
              ) : (
                <Button variant='default' onClick={handleStatusUpdate} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : 'Kích hoạt'}
                </Button>
              )}
            </div>
          </>
        )}
      </Main>
    </>
  )
}
