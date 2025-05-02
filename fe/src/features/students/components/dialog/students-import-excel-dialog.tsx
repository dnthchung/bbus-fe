'use client'

import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ImportErrorDialog } from '@/components/common/import-error-dialog'
import { useStudents } from '../../context/students-context'

// ✅ Định dạng file được hỗ trợ
const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'csv', 'txt', 'tsv', 'xlsb', 'ods', 'xml', 'html', 'pdf', 'xla', 'xlam']

// ✅ Schema xác thực bằng Zod
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
  file: fileSchema.optional(), // optional để có thể xóa
})

type StudentImportForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentsImportDialog({ open, onOpenChange }: Props) {
  const [importErrors, setImportErrors] = useState<Record<string, string>>({})
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { refreshStudents } = useStudents()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<StudentImportForm>({
    resolver: zodResolver(formSchema),
  })

  const handleClearFile = () => {
    form.setValue('file', undefined, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: StudentImportForm) => {
    if (!values.file) {
      toast({
        title: 'Vui lòng chọn file',
        description: 'Bạn cần tải lên file trước khi nhập.',
        variant: 'deny',
      })
      return
    }

    setIsLoading(true)
    try {
      await API_SERVICES.students.importStudentFile(values.file)

      toast({
        title: 'Tải file thành công',
        description: (
          <div className='mt-2 space-y-1'>
            <div>
              <strong>File:</strong> {values.file.name}
            </div>
          </div>
        ),
        variant: 'success',
      })

      form.reset()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onOpenChange(false)
      refreshStudents()
    } catch (error: any) {
      const response = error?.response?.data
      const details = response?.details

      if (details && typeof details === 'object') {
        setImportErrors(details)
        setIsErrorDialogOpen(true)
        toast({
          title: 'Import thất bại',
          description: `Có ${Object.keys(details).length} lỗi.`,
          variant: 'deny',
        })
      } else {
        toast({
          title: 'Lỗi nhập danh sách',
          description: response?.message || 'Đã xảy ra lỗi không xác định.',
          variant: 'deny',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(state) => {
          form.reset()
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          onOpenChange(state)
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='text-left'>
            <DialogTitle>Nhập danh sách học sinh</DialogTitle>
            <DialogDescription>
              Tải lên file chứa danh sách học sinh.
              <br />
              Hỗ trợ định dạng: <code>.xls, .xlsx, .csv, .txt, .pdf...</code>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form id='student-import-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* File upload + xóa file */}
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => {
                  const selectedFile = form.watch('file')
                  return (
                    <FormItem>
                      <FormLabel>File học sinh</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <input type='file' ref={fileInputRef} accept={allowedExtensions.map((e) => `.${e}`).join(',')} onChange={(e) => field.onChange(e.target.files)} />
                          {selectedFile && (
                            <Button type='button' size='sm' variant='ghost' onClick={handleClearFile}>
                              Xóa
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </form>
          </Form>

          <DialogFooter className='gap-y-2'>
            <DialogClose asChild>
              <Button variant='outline' disabled={isLoading}>
                Hủy
              </Button>
            </DialogClose>
            <Button type='submit' form='student-import-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Nhập'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportErrorDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen} errors={importErrors} />
    </>
  )
}
