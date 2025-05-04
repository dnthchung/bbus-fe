// path: fe/src/features/settings/profile/components/tab/change-avatar-tab.tsx
import { useEffect, useRef, useState } from 'react'
import { CrossIcon, Loader2 } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { useAuthQuery } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ChangeAvatarTab() {
  const { user, isLoading } = useAuthQuery()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const triggerFileInput = () => fileInputRef.current?.click()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WebP, SVG)',
        variant: 'deny',
      })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setSelectedAvatar(file)
    setAvatarPreviewUrl(previewUrl)
  }

  const handleCancelAvatarUpload = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl)
    }
    fileInputRef.current && (fileInputRef.current.value = '')
    setSelectedAvatar(null)
    setAvatarPreviewUrl(null)
  }

  const handleAvatarUpload = async () => {
    if (!selectedAvatar || !user?.userId) {
      toast({ title: 'Lỗi', description: 'Thiếu file hoặc userId', variant: 'deny' })
      return
    }

    try {
      setUploadingAvatar(true)
      await API_SERVICES.users.update_avatar(`${user.userId}`, selectedAvatar)

      // ✅ Cập nhật lại user sau khi upload
      toast({
        title: 'Thành công',
        description: 'Ảnh đại diện đã được cập nhật',
        variant: 'success',
      })

      handleCancelAvatarUpload()
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật ảnh đại diện', variant: 'deny' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl)
      }
    }
  }, [avatarPreviewUrl])

  if (isLoading || !user) return <p className='text-muted-foreground'>Đang tải dữ liệu...</p>

  return (
    <div className='flex flex-col items-center space-y-4'>
      <Avatar className='h-40 w-40'>
        <AvatarImage src={avatarPreviewUrl || user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>

      <div className='flex flex-col items-center space-y-2'>
        <input type='file' ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept='image/*' />

        <div className='flex space-x-2'>
          <Button type='button' variant='outline' onClick={triggerFileInput}>
            Thay đổi ảnh đại diện
          </Button>
          {selectedAvatar && (
            <Button type='button' variant='outline' onClick={handleCancelAvatarUpload}>
              <CrossIcon className='mr-2 h-4 w-4' /> Xóa
            </Button>
          )}
        </div>

        {selectedAvatar && <div className='text-sm text-muted-foreground'>Ảnh đã chọn: {selectedAvatar.name}</div>}
      </div>

      {selectedAvatar && (
        <Button type='button' onClick={handleAvatarUpload} disabled={uploadingAvatar}>
          {uploadingAvatar && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Lưu ảnh đại diện
        </Button>
      )}
    </div>
  )
}
