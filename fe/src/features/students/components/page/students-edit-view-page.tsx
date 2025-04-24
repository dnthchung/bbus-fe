'use client'

import { useEffect, useState } from 'react'
import { Route } from '@/routes/_authenticated/students/details/$id'
import { ChevronLeft } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StudentsParentInfoTab } from '@/features/students/components/tab/students-parent-info-tab'
import { StudentsPersonalInfoTab } from '@/features/students/components/tab/students-personal-info-tab'
import { StudentsPickupInfoTab } from '@/features/students/components/tab/students-pickup-info-tab'
import type { Student } from '@/features/students/data/schema'

export default function StudentsDetailsContent() {
  const { id } = Route.useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await API_SERVICES.students.getOne(id)
        setStudent(response.data.data)
        setError(null)
      } catch (err) {
        // console.error('Error fetching student details:', err)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin học sinh',
          variant: 'deny',
        })
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

  const handleStudentUpdate = async (payload: { id: string; parentId: string }) => {
    try {
      setLoading(true)

      // ✅ Cập nhật parentId
      await API_SERVICES.students.update({
        id: payload.id,
        parentId: payload.parentId,
      })

      // ✅ Refetch lại thông tin học sinh
      const response = await API_SERVICES.students.getOne(payload.id)
      setStudent(response.data.data)

      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin phụ huynh đã được cập nhật.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating student:', error)
      toast({
        title: 'Cập nhật thất bại',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin phụ huynh: ' + error,
        variant: 'deny',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!student || !id) return
    try {
      setUpdatingStatus(true)
      const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await API_SERVICES.students.updateStatus(id, newStatus)
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
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const handlePersonalInfoUpdate = async (updatedStudent: Student) => {
    try {
      setLoading(true)

      // Gọi API cập nhật thông tin cá nhân
      await API_SERVICES.students.update(updatedStudent)

      // Refetch lại thông tin học sinh (giống như cách xử lý trong handleStudentUpdate)
      const response = await API_SERVICES.students.getOne(updatedStudent.id)
      setStudent(response.data.data)

      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin cá nhân đã được cập nhật.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating student:', error)
      toast({
        title: 'Cập nhật thất bại',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin cá nhân: ' + error,
        variant: 'deny',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePickupInfoUpdate = async (updatedStudent: Student) => {
    try {
      setLoading(true)

      // Gọi API cập nhật thông tin đưa đón
      await API_SERVICES.students.update(updatedStudent)

      // Refetch lại thông tin học sinh
      const response = await API_SERVICES.students.getOne(updatedStudent.id)
      setStudent(response.data.data)

      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin đưa đón đã được cập nhật.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating student:', error)
      toast({
        title: 'Cập nhật thất bại',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin đưa đón: ' + error,
        variant: 'deny',
      })
    } finally {
      setLoading(false)
    }
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
                <span className='text-muted-foreground'>
                  <span className=''>Quản lý học sinh </span>
                </span>
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
            <ChevronLeft className='mr-2 h-4 w-4' /> Quay lại danh sách
          </Button>
        </div>

        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Thông tin chi tiết học sinh</h1>
          <p className='text-muted-foreground'>Xem và quản lý thông tin chi tiết của học sinh.</p>
        </div>

        {loading ? (
          <div className='space-y-6'>
            {/* Skeleton for tabs */}
            <div className='w-1/2'>
              <Skeleton className='h-10 w-full rounded-md' />
            </div>

            {/* Skeleton for content */}
            <Card>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <Skeleton className='h-8 w-1/3' />
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-1/3' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-1/3' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-1/3' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-1/3' />
                      <Skeleton className='h-10 w-full' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skeleton for action button */}
            <div className='border-t pt-4'>
              <Skeleton className='h-10 w-32' />
            </div>
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
            <Tabs defaultValue='personal' className='mb-6' value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-1/2 grid-cols-3'>
                <TabsTrigger value='personal'>Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value='parent'>Thông tin phụ huynh</TabsTrigger>
                <TabsTrigger value='pickup'>Thông tin đưa đón</TabsTrigger>
              </TabsList>

              <TabsContent className='w-full' value='personal'>
                <StudentsPersonalInfoTab student={student} onStudentUpdate={handlePersonalInfoUpdate} formatDate={formatDate} />
              </TabsContent>

              <TabsContent value='parent'>
                <StudentsParentInfoTab student={student} onStudentUpdate={handleStudentUpdate} />
              </TabsContent>

              <TabsContent className='w-1/2' value='pickup'>
                <StudentsPickupInfoTab student={student} onStudentUpdate={handlePickupInfoUpdate} />
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
