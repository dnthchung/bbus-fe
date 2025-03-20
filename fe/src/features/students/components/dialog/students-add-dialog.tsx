'use client'

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/features/users/data/schema'
import { getAllUsersRoleParent } from '@/features/users/data/users'
import { useStudents } from '../../context/students-context'

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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const generateRollNumber = (): string => {
  return `HS${uuidv4()}`
}

export function StudentsAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentUsers, setParentUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { refreshStudents } = useStudents()

  // Lấy danh sách phụ huynh khi dialog mở
  useEffect(() => {
    async function fetchParents() {
      try {
        const parents = await getAllUsersRoleParent()
        setParentUsers(parents)
      } catch (error) {
        console.error('Error fetching parent users:', error)
      }
    }
    if (open) {
      fetchParents()
    }
  }, [open])

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
  const { control, handleSubmit, reset, watch, setValue } = form

  // Lọc danh sách phụ huynh theo searchTerm
  const filteredParentUsers = parentUsers.filter((parent) => {
    const lower = searchTerm.toLowerCase()
    return parent.name.toLowerCase().includes(lower) || (parent.phone && parent.phone.includes(searchTerm))
  })

  // Lấy parentId từ form
  const watchParentId = watch('parentId')

  // Tìm phụ huynh tương ứng
  const selectedParent = parentUsers.find((p) => p.userId === watchParentId)
  // Nếu tìm thấy, hiển thị "Tên - SĐT", nếu không có phone thì "N/A"
  const displayParentText = selectedParent ? `${selectedParent.name} - ${selectedParent.phone ?? 'N/A'}` : ''

  // Chọn phụ huynh => set parentId vào form
  const handleSelectParent = (parentId: string) => {
    setValue('parentId', parentId)
  }

  // Submit
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
      console.log('newStudent', newStudent)

      const response = await API_SERVICES.students.addOne(newStudent)
      console.log('response', response)

      toast({
        title: 'Thêm học sinh thành công',
        description: 'Học sinh mới đã được thêm vào hệ thống',
      })

      reset()
      onOpenChange(false)
      await refreshStudents()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
      toast({
        title: `${error || 'Không thể thêm học sinh'}`,
        description: 'Đã xảy ra lỗi khi thêm học sinh mới. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          reset()
          setSearchTerm('')
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-w-5xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Thêm học sinh mới</DialogTitle>
          <DialogDescription>Tạo học sinh mới ở đây. Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>

        <div className='mt-4 flex gap-4'>
          {/* CỘT TRÁI: FORM */}
          <div className='w-1/2 border-r pr-4'>
            <ScrollArea className='h-[450px] pr-4'>
              <Form {...form}>
                <form id='student-form' onSubmit={handleSubmit(onSubmit)}>
                  {/* Name */}
                  <FormField
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder='Nguyễn Tuấn Hùng' autoComplete='off' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ngày sinh */}
                  <FormField
                    control={control}
                    name='dob'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant='outline' className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Địa chỉ */}
                  <FormField
                    control={control}
                    name='address'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder='VD: Ninh Bình' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Giới tính */}
                  <FormField
                    control={control}
                    name='gender'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          {/* <select className='rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                            <option value='MALE'>Nam</option>
                            <option value='FEMALE'>Nữ</option>
                          </select> */}

                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Lựa chọn giới tính' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Giới tính</SelectLabel>
                                <SelectItem value='MALE'>Nam</SelectItem>
                                <SelectItem value='FEMALE'>Nữ</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ẩn parentId, nhưng hiển thị tên + sdt (selectedParent) */}
                  <FormField
                    control={control}
                    name='parentId'
                    render={() => (
                      <FormItem>
                        <FormLabel>Phụ huynh đã chọn</FormLabel>
                        <FormControl>
                          {/* Hiển thị text: "Tên - SĐT" */}
                          <Input disabled value={displayParentText} placeholder='Chọn phụ huynh ở bảng bên phải' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </ScrollArea>
          </div>

          {/* CỘT PHẢI: DANH SÁCH PHỤ HUYNH (TABLE + SEARCH) */}
          <div className='w-1/2 pl-4'>
            <div className='mb-2 flex items-center'>
              <Input placeholder='Tìm phụ huynh theo tên/điện thoại' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='mr-2' />
            </div>

            <ScrollArea className='h-[400px] rounded border'>
              <table className='w-full text-sm'>
                <thead className='sticky top-0 bg-gray-50'>
                  <tr>
                    <th className='px-3 py-2 text-left'>Tên</th>
                    <th className='px-3 py-2 text-left'>SĐT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={2} className='p-3 text-center'>
                        Không tìm thấy kết quả
                      </td>
                    </tr>
                  ) : (
                    filteredParentUsers.map((parent) => (
                      <tr key={parent.userId} className='cursor-pointer hover:bg-gray-100' onClick={() => handleSelectParent(parent.userId)}>
                        <td className='px-3 py-2'>{parent.name}</td>
                        <td className='px-3 py-2'>{parent.phone || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>

        {/* Footer => Submit button */}
        <DialogFooter>
          <Button
            type='submit'
            form='student-form' // submit form cột trái
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo học sinh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
