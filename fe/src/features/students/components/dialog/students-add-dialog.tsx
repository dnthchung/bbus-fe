'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Search, UserPlus, Check } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { API_SERVICES } from '@/api/api-services'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User } from '@/features/users/data/schema'
import { getParentListFromParentTable } from '@/features/users/data/users'
import { useStudents } from '../../context/students-context'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống' }),
  dob: z.coerce.date({
    required_error: 'Vui lòng chọn ngày sinh hợp lệ',
  }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  gender: z.enum(['MALE', 'FEMALE'], {
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
  const [activeTab, setActiveTab] = useState<'form' | 'parents'>('form')
  const { refreshStudents } = useStudents()

  // Fetch parents when dialog opens
  useEffect(() => {
    async function fetchParents() {
      try {
        const parents = await getParentListFromParentTable()
        const transformedParents = parents.map((parent) => ({
          ...parent,
          userId: parent.id,
          username: parent.id, // or any default value
          role: 'PARENT' as const,
        }))
        setParentUsers(transformedParents)
      } catch (error) {
        console.error('Error fetching parent users:', error)
        toast({
          title: 'Không thể tải danh sách phụ huynh',
          description: 'Vui lòng thử lại sau',
          variant: 'destructive',
        })
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
      gender: 'MALE',
      parentId: '',
    },
  })

  const { control, handleSubmit, reset, watch, setValue } = form

  // Filter parents by search term
  const filteredParentUsers = parentUsers.filter((parent) => {
    const lower = searchTerm.toLowerCase()
    return parent.name.toLowerCase().includes(lower) || (parent.phone && parent.phone.includes(searchTerm))
  })

  // Get parentId from form
  const watchParentId = watch('parentId')

  // Find selected parent
  const selectedParent = parentUsers.find((p) => p.userId === watchParentId)

  // Display parent info
  const displayParentText = selectedParent ? `${selectedParent.name} - ${selectedParent.phone ?? 'N/A'}` : ''

  // Select parent and update form
  const handleSelectParent = (parentId: string) => {
    setValue('parentId', parentId)
    // Switch back to form tab on mobile after selection
    if (window.innerWidth < 768) {
      setActiveTab('form')
    }
  }

  // Submit form
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

      const response = await API_SERVICES.students.addOne(newStudent)

      // Đảm bảo cập nhật danh sách học sinh trước
      await refreshStudents()

      toast({
        title: 'Thêm học sinh thành công',
        description: 'Học sinh mới đã được thêm vào hệ thống',
      })

      reset()
      onOpenChange(false)

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
      <DialogContent className='max-w-4xl overflow-hidden p-0'>
        <DialogHeader className='px-6 pb-2 pt-6'>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <UserPlus className='h-5 w-5' /> Thêm học sinh mới
          </DialogTitle>
          <DialogDescription>Tạo học sinh mới ở đây. Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='student-form' onSubmit={handleSubmit(onSubmit)}>
            {/* Mobile Tabs */}
            <div className='px-6 md:hidden'>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'form' | 'parents')}>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='form'>Thông tin học sinh</TabsTrigger>
                  <TabsTrigger value='parents'>
                    Chọn phụ huynh
                    {selectedParent && (
                      <Badge variant='secondary' className='ml-2'>
                        <Check className='mr-1 h-3 w-3' />
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='form' className='mt-4'>
                  <StudentFormFields control={control} displayParentText={displayParentText} selectedParent={selectedParent} onSelectParentClick={() => setActiveTab('parents')} />
                </TabsContent>
                <TabsContent value='parents' className='mt-4'>
                  <ParentSelector searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredParentUsers={filteredParentUsers} handleSelectParent={handleSelectParent} selectedParentId={watchParentId} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop Layout */}
            <div className='hidden gap-6 px-6 md:flex'>
              <div className='w-1/2'>
                <StudentFormFields control={control} displayParentText={displayParentText} selectedParent={selectedParent} />
              </div>
              <div className='w-1/2'>
                <h3 className='mb-2 text-sm font-medium'>Chọn phụ huynh</h3>
                <ParentSelector searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredParentUsers={filteredParentUsers} handleSelectParent={handleSelectParent} selectedParentId={watchParentId} />
              </div>
            </div>

            <DialogFooter className='bg-muted/30 px-6 py-4'>
              <div className='flex justify-end gap-2'>
                <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                  {isSubmitting ? 'Đang tạo...' : 'Tạo học sinh'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Student Form Fields Component
interface StudentFormFieldsProps {
  control: any
  displayParentText: string
  selectedParent: User | undefined
  onSelectParentClick?: () => void
}

function StudentFormFields({ control, displayParentText, selectedParent, onSelectParentClick }: StudentFormFieldsProps) {
  return (
    <ScrollArea className='h-[400px] pr-4'>
      <div className='space-y-4 pb-4'>
        {/* Name */}
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder='Nguyễn Tuấn Hùng' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={control}
          name='dob'
          render={({ field }) => (
            <FormItem>
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
                    <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder='VD: Ninh Bình' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
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

        {/* Parent Selection */}
        <FormField
          control={control}
          name='parentId'
          render={() => (
            <FormItem>
              <FormLabel>Phụ huynh</FormLabel>
              <div className='space-y-2'>
                {selectedParent ? (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 rounded-md border bg-muted/50 p-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>{selectedParent.name.charAt(0).toUpperCase()}</div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium'>{selectedParent.name}</p>
                        <p className='truncate text-sm text-muted-foreground'>{selectedParent.phone || 'Không có SĐT'}</p>
                      </div>
                    </div>
                    {onSelectParentClick && (
                      <Button type='button' variant='outline' size='sm' onClick={onSelectParentClick}>
                        Thay đổi phụ huynh
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    {onSelectParentClick ? (
                      <Button type='button' variant='outline' className='w-full justify-start text-muted-foreground' onClick={onSelectParentClick}>
                        <Search className='mr-2 h-4 w-4' />
                        Chọn phụ huynh
                      </Button>
                    ) : (
                      <p className='p-2 text-sm text-muted-foreground'>Vui lòng chọn phụ huynh từ danh sách bên phải</p>
                    )}
                  </div>
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </ScrollArea>
  )
}

// Parent Selector Component
interface ParentSelectorProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredParentUsers: User[]
  handleSelectParent: (parentId: string) => void
  selectedParentId: string
}

function ParentSelector({ searchTerm, setSearchTerm, filteredParentUsers, handleSelectParent, selectedParentId }: ParentSelectorProps) {
  return (
    <div className='space-y-2'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input placeholder='Tìm phụ huynh theo tên/điện thoại' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-9' />
      </div>
      <ScrollArea className='h-[340px] rounded-md border'>
        {filteredParentUsers.length === 0 ? (
          <div className='p-4 text-center text-muted-foreground'>Không tìm thấy phụ huynh phù hợp</div>
        ) : (
          <div className='divide-y'>
            {filteredParentUsers.map((parent) => (
              <div key={parent.userId} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors', selectedParentId === parent.userId ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted')} onClick={() => handleSelectParent(parent.userId)}>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>{parent.name.charAt(0).toUpperCase()}</div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>{parent.name}</p>
                  <p className='truncate text-sm text-muted-foreground'>{parent.phone || 'Không có SĐT'}</p>
                </div>
                {selectedParentId === parent.userId && <Check className='h-4 w-4 text-primary' />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
