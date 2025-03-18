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
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectDropdown } from '@/components/common/select-dropdown'
import { userTypes } from '../../data/data'
import { User } from '../../data/schema'

// Mock data nếu không có API
const mockUser: User = {
  id: '24c66ef2-4950-4ecf-a24b-6821631d7f0f',
  username: 'parent',
  name: 'parent',
  gender: 'MALE',
  dob: new Date('2025-02-16'),
  email: 'parent@gmail.com',
  avatar: 'image_url',
  phone: '0912345672',
  address: '74 An Dương',
  status: 'ACTIVE',
  role: 'PARENT',
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  username: z.string().min(1, { message: 'Tên đăng nhập không được để trống.' }),
  phone: z.string().min(1, { message: 'Số điện thoại không được để trống.' }),
  email: z.string().min(1, { message: 'Email không được để trống.' }).email({ message: 'Email không hợp lệ.' }),
  role: z.string().min(1, { message: 'Vai trò không được để trống.' }),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersEditViewDialog({ currentRow, open, onOpenChange }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  // Use provided data or fallback to mock data
  const userData = currentRow || mockUser

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: userData,
  })

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

  // Hàm hủy bỏ khi đang edit
  const onCancelEdit = () => {
    // Reset form về defaultValues (tức là userData)
    form.reset()
    setIsEditing(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
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
          <Form {...form}>
            <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              {/* Họ và tên */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn Văn A' {...field} disabled={!isEditing} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Tên đăng nhập */}
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder='nguyenvana' {...field} disabled />
                    </FormControl>
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
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          {!isEditing ? (
            // Nút "Chỉnh sửa" -> type="button"
            <Button type='button' onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              {/* Nút "Hủy" -> type="button" */}
              <Button type='button' onClick={onCancelEdit}>
                Hủy
              </Button>
              {/* Nút "Lưu thay đổi" -> type="submit" */}
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
