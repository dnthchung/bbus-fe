//path: /D:/Workspace/Github_folder/bbus-fe/fe/src/features/settings/profile/components/tab/change-avatar-tab.tsx
import { useState, useRef, ChangeEvent } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ChangeAvatarTab() {
  const userData = {
    id: 'a9ce782b-15ae-4610-b541-e4ef71f9cfef',
    username: 'sysadmin',
    name: 'Tài khoản sysadmin',
    gender: 'MALE',
    dob: '2025-02-16',
    email: 'sysadmin@gmail.com',
    avatar: 'https://avatar.iran.liara.run/public/21',
    phone: '0912345671',
    address: '74 An Dương',
    status: 'ACTIVE',
    role: 'SYSADMIN',
    twoFactorEnabled: true,
    lastLogin: '2025-03-15T08:24:16Z',
    accountCreated: '2024-10-05T14:30:00Z',
  }
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn file ảnh (JPEG, PNG, GIF, WebP hoặc SVG)',
          variant: 'destructive',
        })
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click()
  }

  const clearAvatarInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleSaveAvatar = () => {
    if (avatarFile) {
      // Logic gọi API để lưu avatar mới
      toast({
        title: 'Cập nhật ảnh đại diện thành công!',
        description: `Ảnh đã chọn: ${avatarFile.name}`,
      })
      // Sau khi lưu thành công, có thể reset trạng thái nếu cần
      // setAvatarFile(null);
      // setAvatarPreview(null);
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4'>
      <Avatar className='h-40 w-40'>
        <AvatarImage src={avatarPreview || userData.avatar} alt={userData.name} />
        <AvatarFallback>{userData.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col items-center space-y-2'>
        <input type='file' ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept='image/png,image/jpeg,image/gif,image/webp,image/svg+xml' />
        <div className='flex space-x-2'>
          <Button type='button' variant='outline' onClick={handleAvatarButtonClick}>
            Thay đổi ảnh đại diện
          </Button>
          {avatarFile && (
            <Button type='button' variant='outline' onClick={clearAvatarInput}>
              <Cross2Icon className='mr-2 h-4 w-4' />
              Xóa
            </Button>
          )}
        </div>
        {avatarFile && <div className='text-sm text-muted-foreground'>Ảnh đã chọn: {avatarFile.name}</div>}
      </div>
      {avatarFile && (
        <Button type='button' onClick={handleSaveAvatar}>
          Lưu ảnh đại diện
        </Button>
      )}
    </div>
  )
}
