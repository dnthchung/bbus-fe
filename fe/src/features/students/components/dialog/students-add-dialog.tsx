'use client'

// path: fe/src/features/students/components/dialog/students-add-dialog.tsx
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User } from '@/features/users/data/schema'
// Import the API function and User type for parent users
import { getAllUsersRoleParent } from '@/features/users/data/users'
import { useStudents } from '../../context/students-context'

// Schema for adding a new student
const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống' }),
  dob: z.coerce.date({ required_error: 'Vui lòng chọn ngày sinh hợp lệ' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính hợp lệ' }),
  }),
  parentId: z.string().uuid({ message: 'Vui lòng chọn phụ huynh hợp lệ' }).min(1, { message: 'Phụ huynh không được để trống' }),
})

type StudentForm = z.infer<typeof formSchema>

// Props for the add-student dialog
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Function to generate a rollNumber using uuid prefixed with "HS"
const generateRollNumber = (): string => {
  return `HS${uuidv4()}`
}

export function StudentsAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentUsers, setParentUsers] = useState<User[]>([])
  const { refreshStudents } = useStudents()

  // Fetch the list of parent users when the component mounts
  useEffect(() => {
    async function fetchParents() {
      try {
        const parents = await getAllUsersRoleParent()
        setParentUsers(parents)
      } catch (error) {
        console.error('Error fetching parent users:', error)
      }
    }
    fetchParents()
  }, [])

  // Setup React Hook Form
  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: undefined,
      address: '',
      gender: 'OTHER',
      parentId: '',
    },
  })

  const { control, handleSubmit, reset } = form

  // Handle submit with API call
  const onSubmit = async (values: StudentForm) => {
    try {
      setIsSubmitting(true)
      const newStudent = {
        rollNumber: generateRollNumber(),
        name: values.name,
        avatar: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Chase',
        dob: values.dob.toISOString(),
        address: values.address,
        gender: values.gender,
        status: 'ACTIVE',
        parentId: values.parentId,
        checkpointId: '',
      }

      // Call API to add a new student
      const response = await API_SERVICES.students.addOne(newStudent)
      console.log('response', response)
      toast({
        title: 'Thêm học sinh thành công',
        description: 'Học sinh mới đã được thêm vào hệ thống',
      })

      // Close dialog and reset form
      reset()
      onOpenChange(false)
      await refreshStudents()

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
      toast({
        title: 'Không thể thêm học sinh',
        description: 'Đã xảy ra lỗi khi thêm học sinh mới. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Thêm học sinh mới</DialogTitle>
          <DialogDescription>Tạo học sinh mới ở đây. Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              {/* Student Name */}
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Tuấn Hùng' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Date of Birth */}
              <FormField
                control={control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Ngày sinh</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant='outline' className={cn('col-span-4 w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Address */}
              <FormField
                control={control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='col-span-2 text-right'>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='Ninh Bình' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Gender */}
              <FormField
                control={control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-12 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Giới tính</FormLabel>
                    <FormControl>
                      <select className='col-span-4 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value='MALE'>Nam</option>
                        <option value='FEMALE'>Nữ</option>
                        <option value='OTHER'>Khác</option>
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {/* Parent Selection */}
              <FormField
                control={control}
                name='parentId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-10 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Phụ huynh</FormLabel>
                    <FormControl>
                      <select className='col-span-4 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value=''>Chọn phụ huynh</option>
                        {parentUsers.map((parent) => (
                          <option key={parent.userId} value={parent.userId}>
                            {parent.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='student-form' disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo học sinh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
