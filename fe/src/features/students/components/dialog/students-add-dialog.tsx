'use client'

// path: fe/src/features/students/components/dialog/students-add-dialog.tsx
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Student } from '../../data/schema'

// --------------------
// 1) Define Zod schema for form
//    This matches the shape of your "studentSchema," plus .optional() for ID
//    and an "isEdit" flag to know if we are editing or adding.
const formSchema = z.object({
  id: z.string().uuid().optional(),
  rollNumber: z.string().min(1, 'Vui lòng nhập mã học sinh'),
  name: z.string().min(1, 'Vui lòng nhập họ và tên'),
  avatar: z.string().url('Phải là URL hợp lệ').optional(),
  dob: z.string().datetime('Sai định dạng ngày giờ'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    errorMap: () => ({ message: 'Trạng thái không hợp lệ' }),
  }),
  parentId: z.string().uuid().optional(),
  parentName: z.string().min(1, 'Vui lòng nhập tên phụ huynh'),
  parentPhone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  checkpointId: z.string().uuid().optional(),
  checkpointName: z.string().min(1, 'Vui lòng nhập điểm dừng'),
  checkpointDescription: z.string().min(1, 'Vui lòng nhập mô tả điểm dừng'),
  isEdit: z.boolean().default(false),
})

type StudentForm = z.infer<typeof formSchema>

// --------------------
// 2) Props for the Add/Edit dialog
interface Props {
  currentRow?: Student
  open: boolean
  onOpenChange: (open: boolean) => void
}

// --------------------
// 3) Component
export function StudentsAddDialog({ currentRow, open, onOpenChange }: Props) {
  // Are we editing?
  const isEdit = !!currentRow

  // -------------------------------------------
  // 4) Setup React Hook Form
  //    Convert `dob` from ISO string <-> date input
  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // If editing, fill in existing data; otherwise use empty or defaults
      id: currentRow?.id,
      rollNumber: currentRow?.rollNumber || '',
      name: currentRow?.name || '',
      avatar: currentRow?.avatar || '',
      dob: currentRow?.dob || new Date().toISOString(), // fallback to "now"
      address: currentRow?.address || '',
      gender: currentRow?.gender || 'OTHER',
      status: currentRow?.status || 'ACTIVE',
      parentId: currentRow?.parentId,
      parentName: currentRow?.parentName || '',
      parentPhone: currentRow?.parentPhone || '',
      checkpointId: currentRow?.checkpointId,
      checkpointName: currentRow?.checkpointName || '',
      checkpointDescription: currentRow?.checkpointDescription || '',
      isEdit,
    },
  })

  const { control, handleSubmit, reset, watch, setValue } = form

  // -------------------------------------------
  // 5) Handle submit
  const onSubmit = (values: StudentForm) => {
    toast({
      title: isEdit ? 'Đã cập nhật học sinh:' : 'Đã thêm học sinh mới:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })

    // reset form & close dialog
    reset()
    onOpenChange(false)
  }

  // -------------------------------------------
  // 6) Convert `dob` from string -> date for input (and back)
  //    Because we stored `dob` as a string in form, let's show it in the <input type="date" />
  const dobVal = watch('dob')
  useEffect(() => {
    if (!dobVal) {
      setValue('dob', new Date().toISOString())
    }
  }, [dobVal, setValue])

  // We'll make a small helper to safely get "yyyy-MM-dd"
  const dobSafeValue = (isoString: string) => {
    try {
      return new Date(isoString).toISOString().substring(0, 10)
    } catch {
      return ''
    }
  }

  // -------------------------------------------
  // 7) Quick preview for avatar
  const avatarUrl = watch('avatar') || ''
  const imagePreview = avatarUrl ? (
    <div className='h-24 w-full overflow-hidden rounded-md bg-gray-200'>
      <img src={avatarUrl} alt='Avatar Preview' className='h-full w-full object-cover' />
    </div>
  ) : null

  // -------------------------------------------
  // 8) Render
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
          <DialogTitle>{isEdit ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin học sinh ở đây.' : 'Tạo học sinh mới ở đây.'}
            {'  '}Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              {/* Mã học sinh (rollNumber) */}
              <FormField
                control={control}
                name='rollNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Mã học sinh</FormLabel>
                    <FormControl>
                      <Input placeholder='MS001' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Tên học sinh (name) */}
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Văn A' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Ngày sinh (dob) */}
              <FormField
                control={control}
                name='dob'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        value={dobSafeValue(field.value)}
                        onChange={(e) => {
                          // convert date pick to ISO string
                          field.onChange(new Date(e.target.value).toISOString())
                        }}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Địa chỉ (address) */}
              <FormField
                control={control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder='Hà Nội, Việt Nam' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Giới tính (gender) */}
              <FormField
                control={control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Giới tính</FormLabel>
                    <FormControl>
                      <select className='rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value='MALE'>Nam</option>
                        <option value='FEMALE'>Nữ</option>
                        <option value='OTHER'>Khác</option>
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Trạng thái (status) */}
              <FormField
                control={control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Trạng thái</FormLabel>
                    <FormControl>
                      <select className='rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value='ACTIVE'>Đang hoạt động</option>
                        <option value='INACTIVE'>Không hoạt động</option>
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Avatar (URL) */}
              <FormField
                control={control}
                name='avatar'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Ảnh đại diện</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com/image.jpg' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Avatar preview */}
              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <div className='col-span-6 flex items-center justify-center'>
                  <div className='h-auto w-20'>{imagePreview}</div>
                </div>
              </div>

              {/* Tên phụ huynh (parentName) */}
              <FormField
                control={control}
                name='parentName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Tên phụ huynh</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Thị B' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Số điện thoại phụ huynh (parentPhone) */}
              <FormField
                control={control}
                name='parentPhone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>SĐT phụ huynh</FormLabel>
                    <FormControl>
                      <Input placeholder='0912345678' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Điểm dừng (checkpointName) */}
              <FormField
                control={control}
                name='checkpointName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Điểm dừng</FormLabel>
                    <FormControl>
                      <Input placeholder='Đại học Quốc gia' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Mô tả điểm dừng (checkpointDescription) */}
              <FormField
                control={control}
                name='checkpointDescription'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Mô tả điểm dừng</FormLabel>
                    <FormControl>
                      <Input placeholder='Điểm dừng trước cổng ĐHQG' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button type='submit' form='student-form'>
            {isEdit ? 'Lưu thay đổi' : 'Tạo học sinh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
