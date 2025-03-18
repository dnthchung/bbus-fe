'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkpoint } from '../../data/schema'

// Schema validation với Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Tên điểm dừng là bắt buộc.' }),
  description: z.string().min(1, { message: 'Mô tả điểm dừng là bắt buộc.' }),
  latitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, { message: 'Vĩ độ không hợp lệ.' }),
  longitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, { message: 'Kinh độ không hợp lệ.' }),
  status: z.enum(['ACTIVE', 'INACTIVE'], { message: 'Trạng thái không hợp lệ.' }),
  isEdit: z.boolean(),
})

type CheckpointForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Checkpoint
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckpointsActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const form = useForm<CheckpointForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { ...currentRow, isEdit }
      : {
          name: '',
          description: '',
          latitude: '',
          longitude: '',
          status: 'ACTIVE',
          isEdit,
        },
  })

  const onSubmit = (values: CheckpointForm) => {
    form.reset()
    toast({
      title: 'Dữ liệu bạn đã gửi:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Chỉnh sửa điểm dừng' : 'Thêm điểm dừng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin điểm dừng xe buýt tại đây. ' : 'Tạo mới một điểm dừng xe buýt. '}
            Nhấn "Lưu thay đổi" khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='checkpoint-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              {/* Tên điểm dừng */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Tên điểm dừng</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Bến xe Mỹ Đình' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Mô tả */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Điểm dừng gần cổng trường' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Vĩ độ (Latitude) */}
              <FormField
                control={form.control}
                name='latitude'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Vĩ độ</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: 21.033781' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Kinh độ (Longitude) */}
              <FormField
                control={form.control}
                name='longitude'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Kinh độ</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: 105.782362' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* Trạng thái */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>Trạng thái</FormLabel>
                    <FormControl>
                      <select {...field} className='col-span-4 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                        <option value='ACTIVE'>Đang hoạt động</option>
                        <option value='INACTIVE'>Không hoạt động</option>
                      </select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        {/* Nút lưu thay đổi */}
        <DialogFooter>
          <Button type='submit' form='checkpoint-form'>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
