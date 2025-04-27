//path url : fe/src/features/buses/list/components/dialog/buses-upload-student-to-camera.tsx
//khi click vào button => mở dialog thông báo bạn có chắc chắn muốn tải danh sách học sinh lên camera khong ?
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useBuses } from '@/features/buses/context/buses-context'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BusesUploadStudentToCamera({ open, onOpenChange }: Props) {
  const { setOpen } = useBuses()

  const handleConfirm = async () => {
    try {
      console.log('handleConfirm')
      const response = await API_SERVICES.camera.upload_student_to_camera()
      if (response.status === 200) {
        toast({ title: 'Tải danh sách học sinh lên camera thành công!', variant: 'success' })
      } else {
        toast({ title: 'Tải danh sách học sinh lên camera thất bại!', variant: 'deny' })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error uploading student to camera:', error)
      toast({ title: 'Có lỗi xảy ra khi tải danh sách học sinh lên camera!', variant: 'deny' })
    } finally {
      setOpen(null)
    }
    setOpen(null)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Tải danh sách học sinh lên camera</DialogTitle>
          <DialogDescription>Vui lòng xác nhận để tải danh sách học sinh lên camera.</DialogDescription>
        </DialogHeader>
        <div className='flex justify-end space-x-2'>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Hủy
          </Button>
          <Button type='submit' onClick={handleConfirm}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
