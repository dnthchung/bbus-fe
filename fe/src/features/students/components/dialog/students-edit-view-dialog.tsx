'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Student } from '../../data/schema'
import { StudentsAcademicParentInfoTab } from '../tab/students-academic-parent-info-tab'
// ** Import hai component Tab vừa tách **
import { StudentsPersonalInfoTab } from '../tab/students-personal-info-tab'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  dob: z.coerce.date({ required_error: 'Ngày sinh không được để trống.' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ.' }),
  }),
  status: z.enum(['ACTIVE', 'INACTIVE'], { required_error: 'Trạng thái không được để trống.' }),
  parentId: z.string().uuid('Phải là UUID hợp lệ.'),
})

export type StudentForm = z.infer<typeof formSchema>

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  currentRow?: Student
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: DialogSize
  onSave?: (updatedData: StudentForm) => void
}

export function StudentsEditViewDialog({ currentRow, open, onOpenChange, size = 'lg', onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [studentData, setStudentData] = useState<Student | null>(null)

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-[90vw] sm:h-[90vh]',
  }

  useEffect(() => {
    if (open && currentRow?.id) {
      setIsLoading(true)
      API_SERVICES.students
        .getOne(currentRow.id)
        .then((response) => {
          console.log('=> API response:', response.data.data)
          setStudentData(response.data.data)
        })
        .catch((error) => {
          console.error('Error fetching student details:', error)
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin học sinh. Vui lòng thử lại sau.',
            variant: 'destructive',
          })
        })
        .finally(() => setIsLoading(false))
    } else {
      setStudentData(null)
      setIsLoading(false)
    }
  }, [open, currentRow])

  const displayData = studentData || currentRow

  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: undefined,
      address: '',
      gender: 'MALE',
      status: 'ACTIVE',
      parentId: '',
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (displayData && !isLoading) {
      console.log('Resetting form with:', displayData)
      reset({
        name: displayData.name,
        dob: new Date(displayData.dob),
        address: displayData.address,
        gender: displayData.gender,
        status: displayData.status,
        parentId: displayData.parentId,
      })
    }
  }, [displayData, reset, isLoading])

  const onSubmit = (values: StudentForm) => {
    if (onSave) {
      onSave(values)
    } else {
      toast({
        title: 'Đã cập nhật thông tin',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
          </pre>
        ),
      })
    }
    setIsEditing(false)
  }

  const onCancelEdit = () => {
    if (displayData) {
      reset({
        name: displayData.name,
        dob: new Date(displayData.dob),
        address: displayData.address,
        gender: displayData.gender,
        status: displayData.status,
        parentId: displayData.parentId,
      })
    }
    setIsEditing(false)
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    return format(new Date(date), 'dd/MM/yyyy')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        reset()
        setIsEditing(false)
        setActiveTab('info')
        setIsLoading(false)
        onOpenChange(state)
      }}
    >
      {/* <DialogContent className={`${sizeClasses[size]} overflow-hidden`}> */}
      <DialogContent className='h-[700px] w-[1000px] overflow-hidden'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEditing ? 'Chỉnh sửa thông tin học sinh' : 'Thông tin học sinh'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Cập nhật thông tin học sinh.' : 'Xem thông tin chi tiết học sinh.'}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : displayData ? (
          <Form {...form}>
            <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
              {/* Thông tin avatar, mã HS, status */}
              <div className='flex items-center space-x-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={displayData.avatar} alt={displayData.name} />
                </Avatar>
                <div className='space-y-1'>
                  <h3 className='text-lg font-medium'>{displayData.name}</h3>
                  <div className='flex items-center space-x-2'>
                    <p className='text-sm text-muted-foreground'>Mã học sinh: {displayData.rollNumber}</p>
                    {/* Bạn có thể viết logic render badge ở đây hoặc di chuyển vào file tab cũng được */}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='grid grid-cols-2'>
                  <TabsTrigger value='info'>Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value='academic'>Học tập & Phụ huynh</TabsTrigger>
                </TabsList>

                <ScrollArea className='mt-4 h-[26rem] w-full'>
                  {/* Tab 1: Thông tin cá nhân */}
                  <TabsContent value='info' className='space-y-4 p-1'>
                    <StudentsPersonalInfoTab displayData={displayData} isEditing={isEditing} formatDate={formatDate} />
                  </TabsContent>

                  {/* Tab 2: Học tập & Phụ huynh */}
                  <TabsContent value='academic' className='space-y-4 p-1'>
                    <StudentsAcademicParentInfoTab displayData={displayData} isEditing={isEditing} />
                  </TabsContent>
                </ScrollArea>
              </Tabs>

              <DialogFooter>
                {!isEditing ? (
                  <Button type='button' onClick={() => setIsEditing(true)} disabled={isLoading}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button type='button' variant='outline' onClick={onCancelEdit} disabled={isLoading}>
                      Hủy
                    </Button>
                    <Button type='submit' form='student-form' disabled={isLoading}>
                      Lưu thay đổi
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <p>Không có dữ liệu học sinh</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
