'use client'

//path : fe/src/features/students/components/page/students-edit-view-page.tsx
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/students/details/$id'
import { MapPin, User, School, ChevronLeft, Pencil, Save, X } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AvatarThumbnail } from '@/features/users/components/avatar-thumbnail'
import { getParentIdByGetEntityByUserId } from '@/features/users/data/users'
import type { Student } from '../../data/schema'
import { StudentsPersonalInfoTab } from '../tab/students-personal-info-tab'
import { StudentsPickupInfoTab } from '../tab/students-pickup-info-tab'

// ----- 1. Chỉnh sửa formSchema -----
// Bổ sung thêm "id" và "rollNumber" để gửi trong body,
// và đánh dấu chúng không được phép chỉnh sửa (sử dụng disabled/hidden input).
const formSchema = z.object({
  id: z.string().uuid('Phải là UUID hợp lệ.'),
  rollNumber: z.string().min(1, { message: 'Mã học sinh không được để trống.' }),
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  dob: z.coerce.date({ required_error: 'Ngày sinh không được để trống.' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ.' }),
  }),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    required_error: 'Trạng thái không được để trống.',
  }),
  parentId: z.string().uuid('Phải là UUID hợp lệ.').optional(),
  checkpointId: z.string().uuid('Phải là UUID hợp lệ.').optional(),
  avatar: z.string().optional(),
})

export type StudentForm = z.infer<typeof formSchema>

export default function StudentsDetailsContent() {
  const { id } = Route.useParams()
  const initialStudentData = Route.useLoaderData() as Student

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [studentData, setStudentData] = useState<Student | null>(null)

  // ----- 2. Khởi tạo useForm -----
  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      rollNumber: '',
      name: '',
      dob: undefined,
      address: '',
      gender: 'MALE',
      status: 'ACTIVE',
      parentId: '',
      checkpointId: '',
      avatar: '',
    },
  })

  const { handleSubmit, reset } = form

  // ----- 3. Lấy dữ liệu student khi id thay đổi -----
  useEffect(() => {
    if (id) {
      setIsLoading(true)
      API_SERVICES.students
        .getOne(id)
        .then((response) => {
          setStudentData(response.data.data)
        })
        .catch((error) => {
          console.error('Error fetching student details:', error)
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin học sinh. Vui lòng thử lại sau.',
            variant: 'destructive',
          })
          // Dùng dữ liệu ban đầu từ loader nếu API thất bại
          setStudentData(initialStudentData)
        })
        .finally(() => setIsLoading(false))
    } else {
      setStudentData(initialStudentData)
      setIsLoading(false)
    }
  }, [id, initialStudentData])

  // ----- 4. Reset form khi studentData thay đổi -----
  useEffect(() => {
    const displayData = studentData || initialStudentData
    if (displayData && !isLoading) {
      reset({
        id: displayData.id,
        rollNumber: displayData.rollNumber,
        name: displayData.name,
        dob: new Date(displayData.dob),
        address: displayData.address,
        gender: displayData.gender,
        status: displayData.status,
        parentId: displayData.parentId || displayData.parent?.userId || '',
        checkpointId: displayData.checkpointId || '',
        avatar: displayData.avatar || '',
      })
    }
  }, [studentData, initialStudentData, reset, isLoading])

  // ----- 5. Submit form -----
  // const onSubmit = async (values: StudentForm) => {
  //   setIsLoading(true)

  //   try {
  //     // Get the real parentId from the userId
  //     const parentId = await getParentIdByGetEntityByUserId(values.parentId)

  //     // Update the values with the real parentId
  //     const updatedValues = {
  //       ...values,
  //       parentId: parentId, // Or possibly parent.id, depending on your data structure
  //     }

  //     console.log('===> Submitting form with:', updatedValues)

  //     // Call API to update student
  //     await API_SERVICES.students.update(updatedValues)

  //     toast({
  //       title: 'Thành công',
  //       description: 'Đã cập nhật thông tin học sinh.',
  //     })

  //     // Refresh student data after update
  //     const response = await API_SERVICES.students.getOne(id)
  //     setStudentData(response.data.data)

  //     setIsEditing(false)
  //   } catch (error) {
  //     console.error('Error updating student:', error)
  //     toast({
  //       title: 'Lỗi',
  //       description: 'Không thể cập nhật thông tin học sinh. Vui lòng thử lại sau.',
  //       variant: 'destructive',
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const onSubmit = async (values: StudentForm) => {
    console.log('clicked')
    setIsLoading(true)
    try {
      // Basic student information for update
      const studentInfoUpdate = {
        id: values.id,
        rollNumber: values.rollNumber,
        name: values.name,
        dob: values.dob,
        address: values.address,
        gender: values.gender,
        status: values.status,
        avatar: values.avatar,
      }

      // Update basic student information
      console.log('===> Updating student basic info:', studentInfoUpdate)
      await API_SERVICES.students.update(studentInfoUpdate)

      // If parentId is provided, update parent separately
      if (values.parentId) {
        try {
          // Get the real parentId from the userId
          const parentId = await getParentIdByGetEntityByUserId(values.parentId)

          // Update parent assignment in a separate request
          const parentUpdate = {
            id: values.id,
            parentId: parentId,
          }

          console.log('===> Updating student parent:', parentUpdate)
          await API_SERVICES.students.updateParent(parentUpdate)
        } catch (parentError) {
          console.error('Error updating student parent:', parentError)
          toast({
            title: 'Cảnh báo',
            description: 'Đã cập nhật thông tin học sinh nhưng không thể cập nhật thông tin phụ huynh.',
            // variant: 'warning',
          })
          // Continue with success since the basic info was saved
        }
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin học sinh.',
      })

      // Refresh student data after update
      const response = await API_SERVICES.students.getOne(values.id)
      setStudentData(response.data.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating student:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin học sinh. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ----- 6. Cancel edit -----
  const onCancelEdit = () => {
    const displayData = studentData || initialStudentData
    if (displayData) {
      reset({
        id: displayData.id,
        rollNumber: displayData.rollNumber,
        name: displayData.name,
        dob: new Date(displayData.dob),
        address: displayData.address,
        gender: displayData.gender,
        status: displayData.status,
        parentId: displayData.parentId || displayData.parent?.userId || '',
        checkpointId: displayData.checkpointId || '',
        avatar: displayData.avatar || '',
      })
    }
    setIsEditing(false)
  }

  // ----- 7. Hàm format date -----
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    return format(new Date(date), 'dd/MM/yyyy')
  }

  const displayData = studentData || initialStudentData

  // ----- 8. Badge hiển thị trạng thái -----
  const renderStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>Đang sử dụng</Badge>
    }
    return (
      <Badge variant='outline' className='text-gray-600'>
        Không hoạt động
      </Badge>
    )
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' className='mr-2' onClick={() => window.history.back()}>
            <ChevronLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-lg font-medium'>Quản lý học sinh</h1>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>
          {isLoading && !displayData ? (
            <div className='flex h-64 items-center justify-center'>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : displayData ? (
            <Form {...form}>
              <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='mb-6'>
                {/* ----- Ẩn các trường không được phép chỉnh sửa ----- */}
                <input type='hidden' {...form.register('id')} />
                <input type='hidden' {...form.register('rollNumber')} />
                <input type='hidden' {...form.register('checkpointId')} />
                <input type='hidden' {...form.register('avatar')} />
                {/* ----- Profile Banner ----- */}
                <div className='relative rounded-lg p-6 dark:bg-gray-800'>
                  <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
                    <div className='flex items-center space-x-4'>
                      <AvatarThumbnail url={displayData.avatar} alt={displayData.name} className='h-36 w-36 rounded-lg border-4 border-white object-cover shadow-sm' />
                      <div className='space-y-2'>
                        <h1 className='text-2xl font-bold'>{displayData.name}</h1>
                        <div className='flex items-start space-x-2'>
                          <School className='h-4 w-4 text-muted-foreground' />
                          <p className='text-sm text-muted-foreground'>
                            Mã học sinh: <span className='font-medium'>{displayData.rollNumber}</span>
                          </p>
                        </div>

                        <div>{renderStatusBadge(displayData.status)}</div>
                      </div>
                    </div>
                    <div className='absolute right-6 top-6'>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} disabled={isLoading} className='gap-2'>
                          <Pencil className='h-4 w-4' />
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <div className='flex space-x-2'>
                          <Button type='button' variant='outline' onClick={onCancelEdit} disabled={isLoading} className='gap-2'>
                            <X className='h-4 w-4' />
                            Hủy
                          </Button>
                          <Button type='submit' form='student-form' disabled={isLoading} className='gap-2'>
                            <Save className='h-4 w-4' />
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ----- Tabs ----- */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-6 w-full'>
                  <div className='border-none shadow-sm'>
                    <div>
                      <TabsList className='grid w-full max-w-md grid-cols-2'>
                        <TabsTrigger value='info' className='rounded-md'>
                          <User className='mr-2 h-4 w-4' />
                          Thông tin học sinh
                        </TabsTrigger>
                        <TabsTrigger value='pickup' className='rounded-md'>
                          <MapPin className='mr-2 h-4 w-4' />
                          Thông tin đưa đón
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <div>
                      {/* ----- Tab 1: Thông tin học sinh ----- */}
                      <TabsContent value='info' className='space-y-6 animate-in fade-in-50'>
                        <StudentsPersonalInfoTab displayData={displayData} isEditing={isEditing} formatDate={formatDate} />
                      </TabsContent>

                      {/* ----- Tab 2: Thông tin đưa đón ----- */}
                      <TabsContent value='pickup' className='space-y-6 animate-in fade-in-50'>
                        <StudentsPickupInfoTab displayData={displayData} isEditing={isEditing} />
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </form>
            </Form>
          ) : (
            <div className='flex h-64 items-center justify-center'>
              <p>Không có dữ liệu học sinh</p>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
