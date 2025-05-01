'use client'

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

// Zod schema: bắt buộc nhập số từ 20 -> 40
const formSchema = z.object({
  amountOfStudent: z
    .number({
      required_error: 'Bắt buộc nhập số',
      invalid_type_error: 'Phải là số',
    })
    .min(20, 'Số học sinh phải lớn hơn hoặc bằng 20')
    .max(40, 'Số học sinh phải nhỏ hơn hoặc bằng 40'),
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
      amountOfStudent: undefined, // Input mặc định là trống
    },
  })

  const { control, handleSubmit, reset } = form

  const handleFormSubmit = async (values: CapacityForm) => {
    try {
      setIsSubmitting(true)

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
          <DialogDescription>Nhập số lượng học sinh tối đa (từ 20 đến 40).</DialogDescription>
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
                    <Input
                      type='number'
                      min={20}
                      max={40}
                      placeholder='Nhập số học sinh'
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? undefined : Number(value))
                      }}
                    />
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
