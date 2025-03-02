// fe/src/components/common/avatar-thumbnail.tsx
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface AvatarThumbnailProps {
  url: string
  alt?: string
  // className sẽ cho phép ta truyền vào các lớp Tailwind khác nhau
  className?: string
}

export function AvatarThumbnail({ url, alt, className }: AvatarThumbnailProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img
          src={url}
          alt={alt ?? 'avatar'}
          // Kết hợp className mặc định với className tuỳ biến truyền vào
          className={cn('cursor-pointer rounded object-cover transition-opacity hover:opacity-80', className)}
        />
      </DialogTrigger>

      <DialogContent className='max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Avatar Preview</DialogTitle>
          <DialogDescription>Hình ảnh học sinh</DialogDescription>
        </DialogHeader>
        <div className='flex justify-center'>
          <img src={url} alt={alt ?? 'avatar-full'} className='max-h-[70vh] object-contain' />
        </div>
      </DialogContent>
    </Dialog>
  )
}
