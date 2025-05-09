'use client'

import type React from 'react'
import { useEffect, useState, useRef } from 'react'
import { trimValue, isValidPhoneNumber, isValidEmail, isNotEmpty, validateInput } from '@/helpers/validations'
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

function parseUserCreationError(message: string): string {
  const raw = message || ''
  const lower = raw.toLowerCase()

  // Nếu có "email"
  if (lower.includes('email')) {
    const m = raw.match(/email:\s*([^\s,]+)/i)
    if (m) {
      return `Email ${m[1]} đã tồn tại`
    }
  }

  // Nếu có "phone"
  if (lower.includes('phone')) {
    const m = raw.match(/phone:\s*(\d+)/i)
    if (m) {
      return `Số điện thoại ${m[1]} đã tồn tại`
    }
  }

  // fallback: giữ nguyên thông báo gốc hoặc đưa về 1 câu chung
  return 'Đã xảy ra lỗi: ' + raw
}

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
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const getRole = localStorage.getItem('role')

  const MIN_DOB = '1950-01-01'
  const MAX_DOB = '2025-12-31'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getUserById(id)
        console.log('User data:', response)
        setUser(response)
        setEditedUser(response)
        setError(null)
      } catch (err) {
        console.error('Error fetching user details:', err)
        setError(err instanceof Error ? err : new Error('Không thể tải thông tin người dùng'))
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
      setEditedUser(user)
      setValidationErrors({})
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let updatedValue = value
    if (name === 'phone') {
      updatedValue = value.replace(/\D/g, '') // Chỉ cho phép số
    } else if (name === 'dob') {
      updatedValue = value // Giữ nguyên giá trị ngày
    } else if (name === 'name') {
      // Chỉ cho phép chữ cái, số và khoảng trắng
      // updatedValue = value.replace(/[^a-zA-Z0-9\s]/g, '')
      updatedValue = value.replace(/[^\p{L}0-9\s]/gu, '')
    } else {
      updatedValue = value
    }
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: updatedValue,
    }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const trimmedValue = trimValue(value)
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: trimmedValue,
    }))
    const errors: { [key: string]: string } = { ...validationErrors }

    if (name === 'name') {
      const nameRegex = /^[\p{L}0-9\s]+$/u
      const error = validateInput(trimmedValue, [isNotEmpty, (val) => val.length >= 2, (val) => nameRegex.test(val)], ['Họ và tên không được để trống', 'Họ và tên phải có ít nhất 2 ký tự', 'Họ và tên không được chứa ký tự đặc biệt'])
      if (error) {
        errors.name = error
      } else {
        delete errors.name
      }
    }
    if (name === 'phone') {
      const error = validateInput(trimmedValue, [isNotEmpty, isValidPhoneNumber], ['Số điện thoại không được để trống', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0'])
      if (error) {
        errors.phone = error
      } else {
        delete errors.phone
      }
    }
    if (name === 'email') {
      const error = validateInput(trimmedValue, [isNotEmpty, isValidEmail], ['Email không được để trống', 'Email không đúng định dạng'])
      if (error) {
        errors.email = error
      } else {
        delete errors.email
      }
    }
    if (name === 'address') {
      const error = validateInput(trimmedValue, [isNotEmpty, (val) => val.length >= 5], ['Địa chỉ không được để trống', 'Địa chỉ phải có ít nhất 5 ký tự'])
      if (error) {
        errors.address = error
      } else {
        delete errors.address
      }
    }
    if (name === 'dob') {
      if (!trimmedValue) {
        errors.dob = 'Ngày sinh không được để trống'
      } else {
        const selectedDate = new Date(trimmedValue)
        const minDate = new Date(MIN_DOB)
        const maxDate = new Date(MAX_DOB)
        if (isNaN(selectedDate.getTime())) {
          errors.dob = 'Ngày sinh không hợp lệ'
        } else if (selectedDate < minDate || selectedDate > maxDate) {
          errors.dob = 'Ngày sinh phải từ 1950 đến 2025'
        } else {
          delete errors.dob
        }
      }
    }
    setValidationErrors(errors)
  }

  const handleGenderChange = (value: string) => {
    setEditedUser((prev: any) => ({
      ...prev,
      gender: value,
    }))
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    const nameRegex = /^[\p{L}0-9\s]+$/u
    const nameError = validateInput(trimValue(editedUser.name || ''), [isNotEmpty, (val) => val.length >= 2, (val) => nameRegex.test(val)], ['Họ và tên không được để trống', 'Họ và tên phải có ít nhất 2 ký tự', 'Họ và tên không được chứa ký tự đặc biệt'])
    if (nameError) errors.name = nameError
    const phoneError = validateInput(trimValue(editedUser.phone || ''), [isNotEmpty, isValidPhoneNumber], ['Số điện thoại không được để trống', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0'])
    if (phoneError) errors.phone = phoneError
    const emailError = validateInput(trimValue(editedUser.email || ''), [isNotEmpty, isValidEmail], ['Email không được để trống', 'Email không đúng định dạng'])
    if (emailError) errors.email = emailError
    const addressError = validateInput(trimValue(editedUser.address || ''), [isNotEmpty, (val) => val.length >= 5], ['Địa chỉ không được để trống', 'Địa chỉ phải có ít nhất 5 ký tự'])
    if (addressError) errors.address = addressError
    if (!editedUser.dob) {
      errors.dob = 'Ngày sinh không được để trống'
    } else {
      const selectedDate = new Date(editedUser.dob)
      const minDate = new Date(MIN_DOB)
      const maxDate = new Date(MAX_DOB)
      if (isNaN(selectedDate.getTime())) {
        errors.dob = 'Ngày sinh không hợp lệ'
      } else if (selectedDate < minDate || selectedDate > maxDate) {
        errors.dob = 'Ngày sinh phải từ 1950 đến 2025'
      }
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveChanges = async () => {
    try {
      if (!validateForm()) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng kiểm tra lại thông tin',
          variant: 'deny',
        })
        return
      }
      const userDataToUpdate = {
        ...user,
        ...editedUser,
        name: trimValue(editedUser.name || ''),
        phone: trimValue(editedUser.phone || ''),
        email: trimValue(editedUser.email || ''),
        address: trimValue(editedUser.address || ''),
        dob: editedUser.dob,
        id: id,
      }
      delete userDataToUpdate.createdAt
      delete userDataToUpdate.updatedAt
      delete userDataToUpdate.created_at
      delete userDataToUpdate.updated_at
      console.log('Data to be sent:', userDataToUpdate)
      const response = await API_SERVICES.users.update(userDataToUpdate)
      const updatedUserData = response?.data || editedUser
      setUser({ ...user, ...updatedUserData })
      setEditedUser({ ...user, ...updatedUserData })
      setIsEditing(false)
      setValidationErrors({})
      toast({
        title: 'Thành công',
        description: 'Thông tin tài khoản đã được cập nhật',
        variant: 'success',
      })
      try {
        const freshUserData = await getUserById(id)
        if (freshUserData) {
          setUser(freshUserData)
          setEditedUser(freshUserData)
        }
      } catch (fetchErr) {
        console.error('Error fetching updated user data:', fetchErr)
      }
    } catch (error: any) {
      console.error('Error updating user:', error)
      const errorMessage = parseUserCreationError(error?.message || '')
      toast({
        title: 'Không thể cập nhật thông tin',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin. ' + errorMessage,
        variant: 'deny',
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setSelectedAvatar(file)
    setAvatarPreviewUrl(previewUrl)
  }

  const handleAvatarUpload = async () => {
    if (!selectedAvatar || !id) {
      toast({
        title: 'Lỗi',
        description: 'Thiếu file hoặc id',
        variant: 'deny',
      })
      return
    }
    try {
      setUploadingAvatar(true)
      await API_SERVICES.users.update_avatar(id, selectedAvatar)
      const updatedUser = await getUserById(id)
      setUser(updatedUser)
      setEditedUser(updatedUser)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    return () => {
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
                <BreadcrumbLink href='/users'>Danh sách tài khoản</BreadcrumbLink>
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
            <ChevronLeft className='mr-2 h-4 w-4' /> Quay lại danh sách
          </Button>
        </div>
        {loading ? (
          <div className='w-full'>
            <div className='space-y-6'>
              <div>
                <div className='mb-2 h-8 w-3/4 animate-pulse rounded-md bg-muted'></div>
                <div className='h-4 w-1/2 animate-pulse rounded-md bg-muted'></div>
              </div>
              <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                <div className='md:col-span-2'>
                  <div className='overflow-hidden rounded-md border'>
                    {Array(7)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className='flex border-b'>
                          <div className='w-1/3 bg-muted/50 px-4 py-3'>
                            <div className='h-5 w-24 animate-pulse rounded-md bg-muted'></div>
                          </div>
                          <div className='flex-1 px-4 py-3'>
                            <div className='h-5 w-3/4 animate-pulse rounded-md bg-muted'></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <div className='my-6 h-6 w-32 animate-pulse rounded-md bg-muted'></div>
                  <div className='flex flex-col items-center rounded-md border p-5'>
                    <div className='mb-4 h-32 w-32 animate-pulse rounded-full bg-muted'></div>
                    <div className='h-ucial'>Avatar</div>
                  </div>
                </div>
              </div>
            </div>
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
                      <X className='mr-2 h-4 w-4' /> Hủy
                    </Button>
                    <Button size='sm' onClick={handleSaveChanges}>
                      <Save className='mr-2 h-4 w-4' /> Lưu
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
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <div>
                            <Input name='name' value={editedUser.name || ''} onChange={handleInputChange} onBlur={handleInputBlur} className={`max-w-md ${validationErrors.name ? 'border-destructive' : ''}`} />
                            {validationErrors.name && <p className='mt-1 text-sm text-destructive'>{validationErrors.name}</p>}
                          </div>
                        ) : (
                          user.name || 'Chưa cập nhật'
                        )}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Ngày sinh</td>
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <div>
                            <Input name='dob' type='date' value={editedUser.dob ? new Date(editedUser.dob).toISOString().split('T')[0] : ''} onChange={handleInputChange} onBlur={handleInputBlur} min={MIN_DOB} max={MAX_DOB} required className={`max-w-md ${validationErrors.dob ? 'border-destructive' : ''}`} />
                            {validationErrors.dob && <p className='mt-1 text-sm text-destructive'>{validationErrors.dob}</p>}
                          </div>
                        ) : (
                          formatDate(user.dob) || 'Chưa cập nhật'
                        )}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</td>
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <div>
                            <Input name='address' value={editedUser.address || ''} onChange={handleInputChange} onBlur={handleInputBlur} className={`max-w-md ${validationErrors.address ? 'border-destructive' : ''}`} />
                            {validationErrors.address && <p className='mt-1 text-sm text-destructive'>{validationErrors.address}</p>}
                          </div>
                        ) : (
                          user.address || 'Chưa cập nhật'
                        )}
                      </td>
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
                              <SelectItem value='OTHER'>Khác</SelectItem>
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
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <div>
                            <Input name='email' type='email' value={editedUser.email || ''} onChange={handleInputChange} onBlur={handleInputBlur} className={`max-w-md ${validationErrors.email ? 'border-destructive' : ''}`} />
                            {validationErrors.email && <p className='mt-1 text-sm text-destructive'>{validationErrors.email}</p>}
                          </div>
                        ) : (
                          user.email || 'Chưa cập nhật'
                        )}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Số điện thoại</td>
                      <td className='px-4 py-3'>
                        {isEditing ? (
                          <div>
                            <Input name='phone' value={editedUser.phone || ''} onChange={handleInputChange} onBlur={handleInputBlur} className={`max-w-md ${validationErrors.phone ? 'border-destructive' : ''}`} />
                            {validationErrors.phone && <p className='mt-1 text-sm text-destructive'>{validationErrors.phone}</p>}
                          </div>
                        ) : (
                          user.phone || 'Chưa cập nhật'
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className='bg-muted/50 px-4 py-3 font-medium'>Trạng thái</td>
                      <td className='px-4 py-3'>
                        {user.status === 'ACTIVE' ? (
                          <div className='flex items-center'>
                            <Status color='green' showDot={true}>
                              {' '}
                              Đang hoạt động{' '}
                            </Status>
                          </div>
                        ) : (
                          <div className='flex items-center'>
                            <Status color='red' showDot={true}>
                              {' '}
                              Đã vô hiệu hóa{' '}
                            </Status>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {getRole !== 'SYSADMIN' && (
                <div className='mt-6'>
                  <Button variant='destructive' onClick={handleStatusChange} disabled={updatingStatus}>
                    {updatingStatus ? 'Đang xử lý...' : user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  </Button>
                </div>
              )}
              {/* <div className='mt-6'>
                <Button variant='destructive' onClick={handleStatusChange} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </Button>
              </div> */}
            </div>
            <div>
              <h2 className='my-6 text-xl font-semibold'>Ảnh đại diện</h2>
              <div className='flex flex-col items-center rounded-md border p-5'>
                <div className='group relative mb-4 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border' onClick={triggerFileInput}>
                  {avatarPreviewUrl ? (
                    <img src={avatarPreviewUrl || '/placeholder.svg'} alt='Preview' className='h-full w-full object-cover' />
                  ) : user.avatar ? (
                    <Avatar className='h-full w-full'>
                      <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className='text-muted-foreground'>Avatar</div>
                  )}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                    <Upload className='h-6 w-6 text-white' />
                  </div>
                </div>
                <div className='w-full'>
                  <input ref={fileInputRef} type='file' id='avatar-upload' accept='image/*' className='hidden' onChange={handleAvatarChange} disabled={uploadingAvatar} />
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
