// path: fe/src/features/users/components/UsersImportDialog.tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Định nghĩa các đuôi file được phép.
const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xltx']

// Tạo schema cho việc tải lên file.
// Đầu tiên đảm bảo rằng chỉ có đúng một file được tải lên, sau đó chuyển đổi FileList thành đối tượng File,
// và cuối cùng kiểm tra đuôi file có hợp lệ hay không.
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
    {
      message: 'Định dạng file không được hỗ trợ.',
    }
  )

const formSchema = z.object({
  file: fileSchema,
})

type UserImportForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersImportDialog({ open, onOpenChange }: Props) {
  const form = useForm<UserImportForm>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (values: UserImportForm) => {
    // Xử lý values.file theo nhu cầu.
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
          <DialogTitle>Nhập danh sách tài khoản</DialogTitle>
          <DialogDescription>
            Tải lên một file chứa danh sách tài khoản để nhập. Các định dạng file được hỗ trợ:
            <code>.xls, .xlsx, .xlsm, .xltx, .xltm, .csv, .txt, .tsv, .xlsb, .ods, .xml, .html, .pdf, .xla, .xlam</code>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='user-import-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='file'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tải lên File</FormLabel>
                  <FormControl>
                    <input type='file' accept='.xls,.xlsx,.xlsm,.xltx,.xltm,.csv,.txt,.tsv,.xlsb,.ods,.xml,.html,.pdf,.xla,.xlam' onChange={(e) => field.onChange(e.target.files)} />
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
          <Button type='submit' form='user-import-form'>
            Nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
