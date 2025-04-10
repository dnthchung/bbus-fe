'use client'

//path : fe/src/features/buses/list/components/dialog/buses-edit-capacity.tsx
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  amountOfStudent: z.number({ invalid_type_error: 'Phải là số' }).min(0, 'Số học sinh không thể nhỏ hơn 0'),
})

type CapacityForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (value: number) => void
}

export function BusesEditCapacityDialog({ open, onOpenChange, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CapacityForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountOfStudent: 0,
    },
  })

  const { control, handleSubmit, reset } = form

  const handleFormSubmit = async (values: CapacityForm) => {
    try {
      setIsSubmitting(true)
      
      // Call the API to update capacity for all buses
      await API_SERVICES.buses.update_max_capacity_for_all({
        maxCapacity: values.amountOfStudent,
      })

      toast({
        title: 'Đã cập nhật số học sinh',
        description: `Số lượng học sinh tối đa đã được chỉnh sửa thành ${values.amountOfStudent}.`,
        variant: 'success',
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Lỗi:', error)
      toast({
        title: 'Lỗi cập nhật',
        description: 'Không thể cập nhật số học sinh. Vui lòng thử lại.',
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
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa số học sinh</DialogTitle>
          <DialogDescription>Nhập số lượng học sinh tối đa cho tất cả xe buýt.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='amountOfStudent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số học sinh tối đa</FormLabel>
                  <FormControl>
                    <Input type='number' min={0} placeholder='Nhập số học sinh' {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
