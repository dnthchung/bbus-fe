'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImportErrorDialog } from '@/components/common/import-error-dialog'
import { allUsersExceptAdminsTypes, allAdminUsersTypes } from '@/features/users/data'
import { userTypes } from '@/features/users/data'
import { useUsers } from '../../context/users-context'

// Các định dạng file cho phép
const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'csv', 'txt', 'tsv', 'xlsb', 'ods', 'xml', 'html', 'pdf', 'xla', 'xlam']

// Zod schema cho form
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
  file: fileSchema.optional(), // Để xóa được file
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
})

type UserImportForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersImportDialog({ open, onOpenChange }: Props) {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [importErrors, setImportErrors] = useState<Record<string, string>>({})
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { refreshUsers } = useUsers()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<UserImportForm>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const roleFromStorage = localStorage.getItem('role')
    setCurrentUserRole(roleFromStorage)
  }, [])

  const roleOptions = useMemo(() => {
    if (currentUserRole === 'ADMIN') return allUsersExceptAdminsTypes
    if (currentUserRole === 'SYSADMIN') return allAdminUsersTypes
    return []
  }, [currentUserRole])

  // Hàm xử lý xóa file
  const handleClearFile = () => {
    // Reset giá trị trong form
    form.setValue('file', undefined, { shouldValidate: true })

    // Reset trực tiếp input element để UI cũng được cập nhật
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: UserImportForm) => {
    // 🛑 Kiểm tra nếu chưa có file
    if (!values.file) {
      toast({
        title: 'Vui lòng chọn file',
        description: 'Bạn cần tải lên file trước khi nhập.',
        variant: 'deny',
      })
      return
    }

    try {
      await API_SERVICES.users.importUserFile(values.file, values.role)

      // Tìm label tiếng Việt của role đã chọn
      const roleLabel = userTypes.find((role) => role.value === values.role)?.labelVi || values.role

      toast({
        title: 'Tải file thành công',
        description: (
          <div className='mt-2 space-y-1'>
            <div>
              <strong>File:</strong> {values.file.name}
            </div>
            <div>
              <strong>Vai trò:</strong> {roleLabel}
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
      refreshUsers()
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
            <DialogTitle>Nhập danh sách tài khoản</DialogTitle>
            <DialogDescription>
              Tải lên file chứa danh sách tài khoản và chọn vai trò tương ứng.
              <br />
              Hỗ trợ định dạng: <code>.xls, .xlsx, .csv, .txt, .pdf...</code>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form id='user-import-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Dropdown chọn role */}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel>Vai trò người dùng</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn vai trò...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.labelVi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File upload + xóa file */}
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => {
                  const selectedFile = form.watch('file')
                  return (
                    <FormItem>
                      <FormLabel>File Excel</FormLabel>
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
              <Button variant='outline'>Hủy</Button>
            </DialogClose>
            <Button type='submit' form='user-import-form'>
              Nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ImportErrorDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen} errors={importErrors} />
    </>
  )
}
