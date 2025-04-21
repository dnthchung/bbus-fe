'use client'

import type React from 'react'
import { useEffect, useState, useRef } from 'react'
import { Route } from '@/routes/_authenticated/users/list/details/$id'
import { ChevronLeft, Save, X, Upload } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Status } from '@/components/mine/status'
import { getUserById } from '@/features/users/users'

export default function UsersDetailsContent() {
  const { id } = Route.useParams()
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<any | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getUserById(id)
        setUser(response)
        setEditedUser(response)
        setError(null)
      } catch (err) {
        console.error('Error fetching student details:', err)
        setError(err instanceof Error ? err : new Error('Không thể tải thông tin học sinh'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleBack = () => {
    window.history.back()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser(user)
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenderChange = (value: string) => {
    setEditedUser((prev: any) => ({
      ...prev,
      gender: value,
    }))
  }

  const handleSaveChanges = async () => {
    try {
      // Validate phone
      if (!editedUser.phone) {
        toast({
          title: 'Lỗi',
          description: 'Số điện thoại không được để trống',
          variant: 'deny',
        })
        return
      }

      // Prepare data for update, ensuring phone is never null
      const userDataToUpdate = {
        ...user,
        ...editedUser,
        phone: editedUser.phone || '', // Ensure phone is never null
        id: id,
      }

      // Remove fields that should be handled by backend
      delete userDataToUpdate.createdAt
      delete userDataToUpdate.updatedAt
      delete userDataToUpdate.created_at
      delete userDataToUpdate.updated_at

      console.log('Data to be sent:', userDataToUpdate)

      const response = await API_SERVICES.users.update(userDataToUpdate)

      // Check if response has data property and use it, otherwise use the edited user data
      const updatedUserData = response?.data || editedUser

      // Important: Update both state variables with the complete user data
      setUser({ ...user, ...updatedUserData })
      setEditedUser({ ...user, ...updatedUserData })

      setIsEditing(false)
      toast({
        title: 'Thành công',
        description: 'Thông tin tài khoản đã được cập nhật',
        variant: 'success',
      })

      // Fetch fresh data from the server to ensure we have the latest
      try {
        const freshUserData = await getUserById(id)
        if (freshUserData) {
          setUser(freshUserData)
          setEditedUser(freshUserData)
        }
      } catch (fetchErr) {
        console.error('Error fetching updated user data:', fetchErr)
      }
    } catch (err) {
      console.error('Error updating user:', err)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin tài khoản',
        variant: 'deny',
      })
    }
  }
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file)
    setSelectedAvatar(file)
    setAvatarPreviewUrl(previewUrl)
  }

  const handleAvatarUpload = async () => {
    if (!selectedAvatar || !id) {
      toast({
        title: 'Lỗi',
        description: '❌ [Avatar Upload] Thiếu file hoặc id:' + JSON.stringify({ selectedAvatar, id }),
        variant: 'deny',
      })
      return
    }

    try {
      setUploadingAvatar(true)

      await API_SERVICES.users.update_avatar(id, selectedAvatar)

      // Lấy lại thông tin user để cập nhật avatar mới
      const updatedUser = await getUserById(id)

      setUser(updatedUser)
      setEditedUser(updatedUser)

      // Xoá preview cũ
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl)
      }
      setSelectedAvatar(null)
      setAvatarPreviewUrl(null)

      toast({
        title: 'Thành công',
        description: 'Ảnh đại diện đã được cập nhật',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật ảnh đại diện',
        variant: 'deny',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleCancelAvatarUpload = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl)
    }
    setSelectedAvatar(null)
    setAvatarPreviewUrl(null)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    return () => {
      // Clean up any object URLs to avoid memory leaks
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl)
      }
    }
  }, [avatarPreviewUrl])

  const handleStatusChange = async () => {
    if (!id) return

    try {
      setUpdatingStatus(true)
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await API_SERVICES.users.update_status(id, newStatus)

      // Refresh user data to get updated status
      const updatedUser = await getUserById(id)
      setUser(updatedUser)
      setEditedUser(updatedUser)

      toast({
        title: 'Thành công',
        description: `Tài khoản đã được ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'}`,
      })
    } catch (err) {
      console.error('Error updating status:', err)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái tài khoản',
        variant: 'deny',
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý tài khoản</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/students'>Danh sách tài khoản</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{loading ? 'Chi tiết tài khoản' : user ? `${user.name}` : 'Không tìm thấy'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>
      <Main>
        <div className='mb-6'>
          <Button variant='outline' size='sm' onClick={handleBack}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>
        {loading ? (
          <div className='flex h-64 items-center justify-center'>
            <p>Đang tải thông tin...</p>
          </div>
        ) : error ? (
          <div className='rounded-lg bg-destructive/10 p-4'>
            <p className='text-destructive'>{error.message}</p>
          </div>
        ) : user ? (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='md:col-span-2'>
              <div className='flex items-center justify-between'>
                <div className='mb-6'>
                  <h1 className='text-2xl font-bold tracking-tight'>Thông tin chi tiết tài khoản {user.name}</h1>
                  <p className='text-muted-foreground'>Xem và quản lý thông tin chi tiết của tài khoản.</p>
                </div>
                {isEditing ? (
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={handleEditToggle}>
                      <X className='mr-2 h-4 w-4' />
                      Hủy
                    </Button>
                    <Button size='sm' onClick={handleSaveChanges}>
                      <Save className='mr-2 h-4 w-4' />
                      Lưu
                    </Button>
                  </div>
                ) : (
                  <Button variant='outline' size='sm' onClick={handleEditToggle}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>
              <div className='overflow-hidden rounded-md border'>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-b'>
                      <td className='w-1/3 bg-muted/50 px-4 py-3 font-medium'>Họ và tên</td>
                      <td className='px-4 py-3'>{isEditing ? <Input name='name' value={editedUser.name || ''} onChange={handleInputChange} className='max-w-md' /> : user.name || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Ngày sinh</td>
                      <td className='px-4 py-3'>{isEditing ? <Input name='dob' type='date' value={editedUser.dob ? new Date(editedUser.dob).toISOString().split('T')[0] : ''} onChange={handleInputChange} className='max-w-md' /> : formatDate(user.dob) || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</td>
                      <td className='px-4 py-3'>{isEditing ? <Input name='address' value={editedUser.address || ''} onChange={handleInputChange} className='max-w-md' /> : user.address || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Giới tính</td>
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <Select value={editedUser.gender || ''} onValueChange={handleGenderChange}>
                            <SelectTrigger className='max-w-md'>
                              <SelectValue placeholder='Chọn giới tính' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='MALE'>Nam</SelectItem>
                              <SelectItem value='FEMALE'>Nữ</SelectItem>
                              {/* <SelectItem value='OTHER'>Khác</SelectItem> */}
                            </SelectContent>
                          </Select>
                        ) : user.gender === 'MALE' ? (
                          'Nam'
                        ) : user.gender === 'FEMALE' ? (
                          'Nữ'
                        ) : (
                          'Khác'
                        )}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Email</td>
                      <td className='px-4 py-3'>{isEditing ? <Input name='email' type='email' value={editedUser.email || ''} onChange={handleInputChange} className='max-w-md' /> : user.email || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Số điện thoại</td>
                      <td className='px-4 py-3'>{isEditing ? <Input name='phone' value={editedUser.phone || ''} onChange={handleInputChange} className='max-w-md' /> : user.phone || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Trạng thái</td>
                      <td className='px-4 py-3'>
                        {user.status === 'ACTIVE' ? (
                          <div className='flex items-center'>
                            <Status color='green' showDot={true}>
                              Đang hoạt động
                            </Status>
                          </div>
                        ) : (
                          <div className='flex items-center'>
                            <Status color='red' showDot={true}>
                              Đã vô hiệu hóa
                            </Status>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='mt-6'>
                <Button variant='destructive' onClick={handleStatusChange} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </Button>
              </div>
            </div>
            <div>
              <h2 className='my-6 text-xl font-semibold'>Ảnh đại diện</h2>
              <div className='flex flex-col items-center rounded-md border p-5'>
                <div className='group relative mb-4 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border' onClick={triggerFileInput}>
                  {/* Avatar display with hover effect */}
                  {avatarPreviewUrl ? (
                    // Show preview of selected image
                    <img src={avatarPreviewUrl || '/placeholder.svg'} alt='Preview' className='h-full w-full object-cover' />
                  ) : user.avatar ? (
                    // Show current avatar
                    <Avatar className='h-full w-full'>
                      <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    // Show placeholder
                    <div className='text-muted-foreground'>Avatar</div>
                  )}

                  {/* Overlay on hover */}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                    <Upload className='h-6 w-6 text-white' />
                  </div>
                </div>

                <div className='w-full'>
                  {/* Hidden file input */}
                  <input ref={fileInputRef} type='file' id='avatar-upload' accept='image/*' className='hidden' onChange={handleAvatarChange} disabled={uploadingAvatar} />

                  {/* Visible button to trigger file selection */}
                  <div className='flex justify-center gap-2'>
                    <Button variant='outline' onClick={triggerFileInput} className='w-1/2' disabled={uploadingAvatar}>
                      Chọn ảnh
                    </Button>
                  </div>

                  {selectedAvatar && (
                    <div className='mt-4 flex justify-center gap-2'>
                      <Button size='sm' variant='outline' onClick={handleCancelAvatarUpload} disabled={uploadingAvatar}>
                        Hủy
                      </Button>
                      <Button size='sm' onClick={handleAvatarUpload} disabled={uploadingAvatar}>
                        {uploadingAvatar ? 'Đang tải lên...' : 'Lưu ảnh'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='rounded-lg bg-muted p-4'>
            <p>Không tìm thấy thông tin tài khoản</p>
          </div>
        )}
      </Main>
    </>
  )
}
