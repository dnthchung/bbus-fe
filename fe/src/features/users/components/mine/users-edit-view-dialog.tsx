'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSimple, type Province, type District, type Ward } from '@/helpers/addressSimple'
// (1) Import API & hooks
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAddress } from '@/features/users/components/mine/user-address'
// (4) Import sub-components
import { UserAvatar } from '@/features/users/components/mine/user-avatar'
import { UserBasicInfo } from '@/features/users/components/mine/user-basic-info'
import { UserContactInfo } from '@/features/users/components/mine/user-contact-info'
import { UserRoleStatus } from '@/features/users/components/mine/user-role-status'
// (3) Import data & types
import { statusLabels } from '@/features/users/data'
import type { User } from '@/features/users/schema'

// Định nghĩa các định dạng file ảnh được chấp nhận
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Đường dẫn đến ảnh avatar mặc định
const DEFAULT_AVATAR_PATH = '/images/defaultAvatar.png'

// Tạo schema có trường status và các trường địa chỉ chi tiết
const formSchema = z.object({
  name: z.string().min(1, { message: 'Họ và tên không được để trống.' }),
  username: z.string().optional(), // Username không cần validate vì không cho phép sửa
  phone: z.string().min(1, { message: 'Số điện thoại không được để trống.' }),
  email: z.string().min(1, { message: 'Email không được để trống.' }).email({ message: 'Email không hợp lệ.' }),
  role: z.string().min(1, { message: 'Vai trò không được để trống.' }),
  status: z.string().min(1, { message: 'Trạng thái không được để trống.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  dob: z.preprocess((val) => (val ? new Date(val as string | number | Date) : undefined), z.date().optional()),
  // Địa chỉ đầy đủ
  address: z.string().optional(),
  // Các trường địa chỉ chi tiết (chỉ validate khi đang edit)
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  specificAddress: z.string().optional(),
  // Avatar
  avatar: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), 'Kích thước file không được vượt quá 5MB')
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Chỉ chấp nhận các định dạng ảnh: .jpg, .jpeg, .png, .webp, .gif'),
  avatarUrl: z.string().optional(), // URL của avatar hiện tại
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)

  // State cho avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // State cho địa chỉ
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  // State cho role người dùng hiện tại
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  // Dữ liệu fetch được từ API
  const [userData, setUserData] = useState<User | null>(null)

  // Khởi tạo form
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow || {},
  })

  const { watch, setValue, formState } = form

  // Lấy role người dùng hiện tại từ localStorage
  useEffect(() => {
    try {
      const role = localStorage.getItem('role')
      setCurrentUserRole(role || null)
    } catch (error) {
      console.error('Error reading user role from localStorage:', error)
    }
  }, [])

  // Mỗi khi mở dialog & có userId => fetch dữ liệu
  useEffect(() => {
    if (open && currentRow?.userId && !dataFetched) {
      setLoading(true)
      API_SERVICES.users
        .getOne(currentRow.userId)
        .then((response) => {
          const userData = response.data
          setUserData(userData)
          console.log('User details fetched:', userData)

          // Reset form with user data
          form.reset({
            name: userData.name,
            username: userData.username,
            phone: userData.phone,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            gender: userData.gender,
            dob: userData.dob ? new Date(userData.dob) : undefined,
            address: userData.address,
            avatarUrl: userData.avatar,
          })

          // Nếu có avatar URL, set preview
          if (userData.avatar) {
            setAvatarPreview(userData.avatar)
          }

          setDataFetched(true)
        })
        .catch((error) => {
          console.error('Error fetching user details:', error)
          toast({
            title: 'Lỗi khi tải dữ liệu',
            description: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.',
            variant: 'destructive',
          })
        })
        .finally(() => setLoading(false))
    } else if (!open) {
      // Nếu đóng dialog => reset userData và dataFetched flag
      setUserData(null)
      setAvatarPreview(null)
      setDataFetched(false)
    }
  }, [open, currentRow, form, dataFetched])

  // Watch các giá trị địa chỉ để cập nhật
  const provinceValue = watch('province')
  const districtValue = watch('district')
  const wardValue = watch('ward')
  const specificAddressValue = watch('specificAddress')

  // Cập nhật danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (provinceValue) {
      const province = addressSimple.find((p) => p.Id === provinceValue)
      setSelectedProvince(province || null)
      setDistricts(province?.Districts || [])
      setValue('district', '')
      setValue('ward', '')
      setWards([])
    }
  }, [provinceValue, setValue])

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (districtValue && selectedProvince) {
      const district = selectedProvince.Districts?.find((d) => d.Id === districtValue)
      setSelectedDistrict(district || null)
      setWards(district?.Wards || [])
      setValue('ward', '')
    }
  }, [districtValue, selectedProvince, setValue])

  // Cập nhật địa chỉ đầy đủ khi các thành phần địa chỉ thay đổi
  useEffect(() => {
    if (isEditing && provinceValue && districtValue && wardValue && specificAddressValue) {
      const provinceName = addressSimple.find((p) => p.Id === provinceValue)?.Name || ''
      const districtName = districts.find((d) => d.Id === districtValue)?.Name || ''
      const wardName = wards.find((w) => w.Id === wardValue)?.Name || ''
      const fullAddress = `${specificAddressValue}, ${wardName}, ${districtName}, ${provinceName}`
      setValue('address', fullAddress)
    }
  }, [provinceValue, districtValue, wardValue, specificAddressValue, districts, wards, setValue, isEditing])

  // Xử lý khi chọn file ảnh
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Kiểm tra định dạng file
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Định dạng file không hợp lệ',
          description: 'Chỉ chấp nhận các đnh dạng ảnh: .jpg, .jpeg, .png, .webp, .gif',
          variant: 'deny',
        })
        return
      }

      // Kiểm tra kích thước file
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'Kích thước file quá lớn',
          description: 'Kích thước file không được vượt quá 5MB',
          variant: 'deny',
        })
        return
      }

      setValue('avatar', file)
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Xử lý xóa ảnh đã chọn
  const handleRemoveAvatar = () => {
    setValue('avatar', undefined)
    setAvatarPreview(null)
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  // Xử lý cập nhật avatar
  const updateAvatar = async () => {
    try {
      setIsSubmitting(true)

      // Chỉ cập nhật avatar nếu có file mới
      if (!(form.getValues('avatar') instanceof File)) {
        toast({
          title: 'Không có thay đổi',
          description: 'Vui lòng chọn ảnh đại diện mới để cập nhật',
          variant: 'default',
        })
        return false
      }

      // Hiển thị xác nhận trước khi cập nhật
      if (!confirm('Bạn có chắc chắn muốn cập nhật ảnh đại diện?')) {
        return false
      }

      // Sử dụng API method có sẵn
      await API_SERVICES.users.update_avatar(currentRow?.userId || '', form.getValues('avatar') as File)

      toast({
        title: 'Cập nhật avatar thành công',
        description: 'Ảnh đại diện đã được cập nhật',
        variant: 'success',
      })

      // Tải lại dữ liệu
      refreshUserData()
      return true
    } catch (error) {
      console.error('Lỗi khi cập nhật avatar:', error)
      toast({
        title: 'Không thể cập nhật avatar',
        description: 'Đã xảy ra lỗi khi cập nhật ảnh đại diện. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý cập nhật thông tin cá nhân
  const updatePersonalInfo = async (values: UserForm) => {
    try {
      setIsSubmitting(true)

      // Hiển thị xác nhận trước khi cập nhật
      if (!confirm('Bạn có chắc chắn muốn cập nhật thông tin cá nhân?')) {
        return false
      }

      const personalData = {
        userId: currentRow?.userId || '',
        email: values.email,
        phone: values.phone,
        name: values.name,
        address: values.address || '',
        gender: values.gender,
        dob: values.dob ? values.dob.toISOString() : undefined,
      }

      // Sử dụng API method update có sẵn
      await API_SERVICES.users.update(personalData)

      toast({
        title: 'Cập nhật thông tin thành công',
        description: 'Thông tin cá nhân đã được cập nhật',
        variant: 'success',
      })

      // Tải lại dữ liệu
      refreshUserData()
      return true
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error)
      toast({
        title: 'Không thể cập nhật thông tin',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin cá nhân. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý cập nhật trạng thái tài khoản
  const updateAccountStatus = async (values: UserForm) => {
    try {
      setIsSubmitting(true)

      // Hiển thị xác nhận trước khi cập nhật
      if (!confirm('Bạn có chắc chắn muốn cập nhật trạng thái tài khoản?')) {
        return false
      }

      // Cập nhật trạng thái
      await API_SERVICES.users.update_status(currentRow?.userId || '', values.status)

      // Cập nhật vai trò (role) thông qua API update
      await API_SERVICES.users.update({
        userId: currentRow?.userId || '',
        role: values.role,
      })

      toast({
        title: 'Cập nhật trạng thái thành công',
        description: 'Trạng thái tài khoản đã được cập nhật',
        variant: 'success',
      })

      // Tải lại dữ liệu
      refreshUserData()
      return true
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái tài khoản:', error)
      toast({
        title: 'Không thể cập nhật trạng thái',
        description: 'Đã xảy ra lỗi khi cập nhật trạng thái tài khoản. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hàm tải lại dữ liệu người dùng
  const refreshUserData = () => {
    if (currentRow?.userId) {
      setLoading(true)
      API_SERVICES.users
        .getOne(currentRow.userId)
        .then((response) => {
          setUserData(response.data)
          if (response.data?.avatar) {
            setAvatarPreview(response.data.avatar)
          }

          // Cập nhật form với dữ liệu mới
          form.reset({
            name: response.data.name,
            username: response.data.username,
            phone: response.data.phone,
            email: response.data.email,
            role: response.data.role,
            status: response.data.status,
            gender: response.data.gender,
            dob: response.data.dob ? new Date(response.data.dob) : undefined,
            address: response.data.address,
            avatarUrl: response.data.avatar,
          })
        })
        .catch((error) => {
          console.error('Error refreshing user details:', error)
          toast({
            title: 'Lỗi khi tải lại dữ liệu',
            description: 'Không thể tải lại thông tin người dùng. Vui lòng thử lại sau.',
            variant: 'destructive',
          })
        })
        .finally(() => setLoading(false))
    }
  }

  // Xử lý submit form
  const onSubmit = async (values: UserForm) => {
    try {
      setIsSubmitting(true)

      // Hiển thị xác nhận trước khi cập nhật tất cả
      if (!confirm('Bạn có chắc chắn muốn cập nhật tất cả thông tin?')) {
        setIsSubmitting(false)
        return
      }

      // Gọi các hàm cập nhật riêng biệt
      const avatarUpdated = form.getValues('avatar') instanceof File ? await updateAvatar() : true
      const personalInfoUpdated = await updatePersonalInfo(values)
      const accountStatusUpdated = await updateAccountStatus(values)

      if (avatarUpdated && personalInfoUpdated && accountStatusUpdated) {
        setIsEditing(false)
        refreshUserData()
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
      toast({
        title: 'Không thể cập nhật người dùng',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel edit
  const onCancelEdit = () => {
    form.reset()
    setIsEditing(false)
    // Reset avatar preview về giá trị ban đầu
    setAvatarPreview(userData?.avatar || null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // Mỗi khi đóng dialog => reset form & disable edit
        if (!state) {
          form.reset()
          setIsEditing(false)
          setAvatarPreview(null)
          setDataFetched(false)
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEditing ? 'Chỉnh sửa người dùng' : 'Thông tin người dùng'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Cập nhật thông tin người dùng.' : 'Xem thông tin chi tiết người dùng.'}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 max-h-[70vh] w-full py-1 pr-4'>
          {/* Nếu đang loading => hiển thị chờ */}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <Form {...form}>
              <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 p-0.5'>
                {/* Avatar upload */}
                <UserAvatar avatarPreview={avatarPreview} userData={userData} defaultAvatarPath={DEFAULT_AVATAR_PATH} isEditing={isEditing} handleRemoveAvatar={handleRemoveAvatar} handleAvatarChange={handleAvatarChange} formErrors={formState.errors} />

                {/* Thông tin cơ bản */}
                <UserBasicInfo form={form} isEditing={isEditing} />

                {/* Thông tin liên hệ */}
                <UserContactInfo form={form} isEditing={isEditing} />

                {/* Vai trò và trạng thái */}
                <UserRoleStatus form={form} isEditing={isEditing} currentUserRole={currentUserRole} statusLabels={statusLabels} />

                {/* Địa chỉ */}
                <UserAddress form={form} isEditing={isEditing} addressSimple={addressSimple} districts={districts} wards={wards} provinceValue={provinceValue} districtValue={districtValue} wardValue={wardValue} />
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
              <Button type='button' variant='outline' onClick={onCancelEdit}>
                Hủy
              </Button>
              <div className='flex gap-2'>
                {form.getValues('avatar') instanceof File && (
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={async () => {
                      const success = await updateAvatar()
                      if (success) onCancelEdit()
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Cập nhật avatar'}
                  </Button>
                )}
                <Button
                  type='button'
                  variant='secondary'
                  onClick={async () => {
                    const success = await updatePersonalInfo(form.getValues())
                    if (success) onCancelEdit()
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Cập nhật thông tin'}
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={async () => {
                    const success = await updateAccountStatus(form.getValues())
                    if (success) onCancelEdit()
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Cập nhật trạng thái'}
                </Button>
                <Button type='submit' form='user-form' disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu tất cả'}
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
