'use client'

// path: fe/src/features/students/components/dialog/students-add-dialog.tsx
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Student } from '../../data/schema'

const baseObject = z.object({
  studentId: z.string().uuid().optional(),
  avatar: z.string().url(),
  fullName: z.string(),
  birthDate: z.coerce.date(),
  grade: z.number().int().min(1).max(9),
  class: z.string().regex(/^[1-9][A-J]$/, { message: "Class must match e.g. '1A', '2B', ... '9J'" }),
  busServiceStatus: z.union([z.literal('Đang sử dụng'), z.literal('Tạm ngừng sử dụng')]),
})

const formSchema = baseObject
  .extend({
    isEdit: z.boolean().default(false),
    classSuffix: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']).default('A'),
  })
  .superRefine(({ grade, class: c }, ctx) => {
    const gradeFromClass = parseInt(c[0], 10)
    if (gradeFromClass !== grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['class'],
        message: `Class '${c}' doesn't match grade ${grade}.`,
      })
    }
  })

type StudentForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Student
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentsAddDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const defaultGrade = currentRow?.grade || 1
  const defaultClass = currentRow?.class || '1A'
  const suffix = defaultClass[1] || 'A'

  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: currentRow?.studentId,
      avatar: currentRow?.avatar || '',
      fullName: currentRow?.fullName || '',
      birthDate: currentRow?.birthDate ? new Date(currentRow.birthDate) : new Date(),
      grade: defaultGrade,
      class: defaultClass,
      busServiceStatus: currentRow?.busServiceStatus || 'Đang sử dụng',
      isEdit,
      classSuffix: suffix as any,
    },
  })

  const { control, handleSubmit, setValue, reset } = form
  const watchedGrade = useWatch({ control, name: 'grade' })
  const watchedSuffix = useWatch({ control, name: 'classSuffix' })

  useEffect(() => {
    const newClassVal = `${watchedGrade}${watchedSuffix}`
    setValue('class', newClassVal)
  }, [watchedGrade, watchedSuffix, setValue])

  const onSubmit = (values: StudentForm) => {
    toast({
      title: 'Bạn đã gửi các giá trị sau:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
    reset()
    onOpenChange(false)
  }

  const imagePreview = form.watch('avatar') ? (
    <div className='h-24 w-full overflow-hidden rounded-md bg-gray-200'>
      <img src={form.watch('avatar')} alt='Avatar Preview' className='h-full w-full object-cover' />
    </div>
  ) : null

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        {/* <DialogContent className='max-w-[800px]'> */}
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Cập nhật thông tin học sinh ở đây.' : 'Tạo học sinh mới ở đây.'} Nhấn lưu khi hoàn tất.</DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              <FormField
                control={control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='John' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input className='col-span-4' type='date' value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='grade'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Khối</FormLabel>
                    <FormControl>
                      <select className='col-span-4rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={(e) => field.onChange(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                          <option key={g} value={g}>
                            {' '}
                            {g}{' '}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='classSuffix'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Lớp</FormLabel>
                    <FormControl>
                      <select className='rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((s) => (
                          <option key={s} value={s}>
                            {' '}
                            {s}{' '}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='avatar'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Avatar</FormLabel>
                    <FormControl>
                      <Input {...field} className='col-span-4' placeholder='https://example.com/image.jpg' />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <div className='col-span-6 flex items-center justify-center'>
                  <div className='h-auto w-20'>{imagePreview}</div>
                </div>
              </div>

              <FormField
                control={control}
                name='busServiceStatus'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Dịch vụ xe buýt</FormLabel>
                    <FormControl>
                      <select className='col-span-4 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1' value={field.value} onChange={field.onChange}>
                        <option value='Đang sử dụng'>Đang sử dụng</option>
                        <option value='Tạm ngừng sử dụng'>Tạm ngừng sử dụng</option>
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
          <Button type='submit' form='student-form'>
            {isEdit ? 'Lưu thay đổi' : 'Tạo học sinh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
