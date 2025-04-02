//path : fe/src/features/buses/list/components/dialog/buses-edit-capacity.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

//path : fe/src/features/buses/list/components/dialog/buses-edit-capacity.tsx

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
      onSubmit(values.amountOfStudent)

      toast({
        title: 'Đã cập nhật số học sinh',
        description: `Số lượng học sinh đã được chỉnh sửa thành ${values.amountOfStudent}.`,
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
          <DialogDescription>Nhập số lượng học sinh được phép lên xe.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='amountOfStudent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số học sinh</FormLabel>
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
