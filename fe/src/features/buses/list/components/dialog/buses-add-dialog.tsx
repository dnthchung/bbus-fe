'use client'

//path  : fe/src/features/buses/components/dialog/buses-add-dialog.tsx
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

// Schema riêng cho form thêm xe buýt
const formSchema = z.object({
  licensePlate: z.string().min(1, 'Vui lòng nhập biển số xe'),
  name: z.string().min(1, 'Vui lòng nhập tên xe buýt'),
  driverId: z.string().uuid('ID tài xế không hợp lệ'),
  driverName: z.string().min(1, 'Vui lòng nhập tên tài xế'),
  route: z.string().min(1, 'Vui lòng nhập tuyến đường'),
  espId: z.string().min(1, 'Vui lòng nhập ID ESP'),
  cameraFacesluice: z.string().min(1, 'Vui lòng nhập ID camera khuôn mặt'),
})

type BusForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BusesAddDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BusForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licensePlate: '',
      name: '',
      driverId: '',
      driverName: '',
      route: '',
      espId: '',
      cameraFacesluice: '',
    },
  })

  const { control, handleSubmit, reset } = form

  const onSubmit = async (values: BusForm) => {
    try {
      setIsSubmitting(true)

      const newBus = {
        id: uuidv4(),
        ...values,
      }
      console.log('newBus', newBus)
      // const response = await API_SERVICES.buses.addOne(newBus)
      // console.log('Bus added:', response)

      toast({
        title: 'Thêm xe buýt thành công',
        description: 'Xe buýt mới đã được thêm vào hệ thống',
        variant: 'success',
      })

      reset()
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Lỗi khi thêm xe buýt:', error)
      toast({
        title: 'Không thể thêm xe buýt',
        description: 'Đã xảy ra lỗi khi thêm xe buýt. Vui lòng thử lại.',
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
        if (!state) reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Thêm xe buýt mới</DialogTitle>
          <DialogDescription>Nhập thông tin xe buýt cần thêm.</DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[26rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form id='bus-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              <FormField
                control={control}
                name='licensePlate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biển số xe</FormLabel>
                    <FormControl>
                      <Input placeholder='51B-123.45' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên xe buýt</FormLabel>
                    <FormControl>
                      <Input placeholder='Xe buýt số 1' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='driverId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Tài xế</FormLabel>
                    <FormControl>
                      <Input placeholder='UUID của tài xế' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='driverName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài xế</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Văn A' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='route'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuyến đường</FormLabel>
                    <FormControl>
                      <Input placeholder='Quận 1 - Quận 5' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='espId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID ESP</FormLabel>
                    <FormControl>
                      <Input placeholder='esp_001' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='cameraFacesluice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Camera nhận diện khuôn mặt</FormLabel>
                    <FormControl>
                      <Input placeholder='cam_face_01' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button type='submit' form='bus-form' disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo xe buýt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
