'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// (1) Import API & hooks
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
// (2) Import UI components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectDropdown } from '@/components/common/select-dropdown'
// (3) Import data & types
import { userTypes, statusLabels } from '../../data'
import { User } from '../../schema'

// (4) Tạo schema có trường status
const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  username: z.string().min(1, { message: 'Tên đăng nhập không được để trống.' }),
  phone: z.string().min(1, { message: 'Số điện thoại không được để trống.' }),
  email: z.string().min(1, { message: 'Email không được để trống.' }).email({ message: 'Email không hợp lệ.' }),
  role: z.string().min(1, { message: 'Vai trò không được để trống.' }),
  // Thêm status:
  status: z.string().min(1, { message: 'Trạng thái không được để trống.' }),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersEditViewDialog({ currentRow, open, onOpenChange }: Props) {
  // State cho toggle edit & loading
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Dữ liệu fetch được từ API
  const [userData, setUserData] = useState<User | null>(null)

  // Mỗi khi mở dialog & có userId => fetch dữ liệu
  useEffect(() => {
    if (open && currentRow?.userId) {
      setLoading(true)
      API_SERVICES.users
        .getOne(currentRow.userId)
        .then((response) => {
          setUserData(response.data) // Tuỳ backend trả về
        })
        .catch((error) => {
          console.error('Error fetching user details:', error)
        })
        .finally(() => setLoading(false))
    } else {
      // Nếu đóng dialog hoặc currentRow rỗng => reset userData
      setUserData(null)
    }
  }, [open, currentRow])

  // Khởi tạo form
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    // Nếu có currentRow => fill trước; tuỳ logic, bạn có thể dùng userData:
    defaultValues: currentRow || {},
  })

  // Xử lý submit form
  const onSubmit = (values: UserForm) => {
    toast({
      title: 'Dữ liệu đã gửi:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
    setIsEditing(false)
  }

  // Cancel edit
  const onCancelEdit = () => {
    form.reset()
    setIsEditing(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // Mỗi khi đóng dialog => reset form & disable edit
        form.reset()
        setIsEditing(false)
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEditing ? 'Chỉnh sửa người dùng' : 'Thông tin người dùng'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Cập nhật thông tin người dùng.' : 'Xem thông tin chi tiết người dùng.'}</DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          {/* Nếu đang loading => hiển thị chờ */}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <Form {...form}>
              <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
                {/* Họ tên */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder='Nguyễn Văn A' {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='example@gmail.com' {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Số điện thoại */}
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder='+84123456789' {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vai trò */}
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Chọn vai trò'
                          items={userTypes.map(({ labelVi, value }) => ({
                            label: labelVi,
                            value,
                          }))}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Trạng thái (status) */}
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Chọn trạng thái'
                          items={Object.entries(statusLabels).map(([key, label]) => ({
                            label, // Ví dụ: 'Đang hoạt động', 'Không hoạt động'
                            value: key, // Ví dụ: 'ACTIVE', 'INACTIVE'
                          }))}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </ScrollArea>

        {/* Footer: nút bấm */}
        <DialogFooter>
          {!isEditing ? (
            <Button type='button' onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button type='button' onClick={onCancelEdit}>
                Hủy
              </Button>
              <Button type='submit' form='user-form'>
                Lưu thay đổi
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
