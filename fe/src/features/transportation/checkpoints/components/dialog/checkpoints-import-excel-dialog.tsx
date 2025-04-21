'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Định nghĩa các đuôi file được phép
const allowedExtensions = ['xls', 'xlsx', 'xlsm']

// Tạo schema cho việc tải lên file
const fileSchema = z
  .instanceof(FileList)
  .refine((files) => files.length === 1, {
    message: 'Vui lòng tải lên đúng một file.',
  })
  .transform((files) => files.item(0)!)
  .refine(
    (file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return extension ? allowedExtensions.includes(extension) : false
    },
    { message: 'Định dạng file không được hỗ trợ.' }
  )

const formSchema = z.object({
  file: fileSchema,
})

type CheckpointImportForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckpointsImportDialog({ open, onOpenChange }: Props) {
  const form = useForm<CheckpointImportForm>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (values: CheckpointImportForm) => {
    // Xử lý values.file theo nhu cầu
    form.reset()
    toast({
      title: 'Tải file thành công',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{values.file.name}</code>
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
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-left'>
          <DialogTitle>Nhập danh sách điểm dừng xe buýt</DialogTitle>
          <DialogDescription>
            Tải lên một file chứa danh sách điểm dừng để nhập. Các định dạng file được hỗ trợ: <code>.xls, .xlsx, .xlsm</code>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='checkpoint-import-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='file'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tải lên File</FormLabel>
                  <FormControl>
                    <input type='file' accept='.xls,.xlsx,.xlsm' onChange={(e) => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DialogClose>
          <Button type='submit' form='checkpoint-import-form'>
            Nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
