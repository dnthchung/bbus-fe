'use client'

import { useState, useEffect } from 'react'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Status } from '@/components/mine/status'
import { useCheckpoints } from '@/features/transportation/checkpoints/context/checkpoints-context'
import type { Checkpoint } from '@/features/transportation/checkpoints/data/schema'
import { getNumberOfStudentInEachCheckpoint } from '@/features/transportation/function'

interface Props {
  currentRow?: Checkpoint
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckpointsActionDialog({ currentRow, open, onOpenChange }: Props) {
  const [saving, setSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [studentCount, setStudentCount] = useState<number | null>(null)
  const [checkpointDetails, setCheckpointDetails] = useState<Checkpoint | null>(null)

  const { refreshCheckpoints } = useCheckpoints()

  useEffect(() => {
    const fetchDetails = async () => {
      if (!currentRow) return setIsLoading(true)
      try {
        setCheckpointDetails(currentRow)

        // 👇 Gọi API lấy số học sinh
        const count = await getNumberOfStudentInEachCheckpoint(currentRow.id)
        setStudentCount(count)
      } catch (error) {
        console.error('Error loading checkpoint or student count:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [currentRow])

  // const toggleStatus = async () => {
  //   if (!currentRow) return
  //   const newStatus = currentRow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  //   setSaving(true)

  //   try {
  //     // await API_SERVICES.checkpoints.update_status(currentRow.id, newStatus)
  //     await API_SERVICES.checkpoints.update_status_auto_in_backend(currentRow.id) // Gọi API cập nhật trạng thái
  //     await refreshCheckpoints()
  //     onOpenChange(false) // Đóng sau khi refresh xong

  //     toast({
  //       title: 'Cập nhật trạng thái thành công',
  //       description: newStatus === 'ACTIVE' ? 'Điểm dừng đã được kích hoạt.' : 'Điểm dừng đã được dừng hoạt động.',
  //       variant: 'success',
  //     })
  //   } catch {
  //     toast({
  //       title: 'Thất bại',
  //       description: 'Không thể cập nhật trạng thái.',
  //       variant: 'deny',
  //     })
  //   } finally {
  //     setSaving(false)
  //   }
  // }
  const toggleStatus = async () => {
    if (!currentRow) return

    // 👉 Nếu đang có học sinh thì không cho đổi trạng thái
    if (studentCount && studentCount > 0) {
      toast({
        title: 'Không thể thay đổi trạng thái',
        description: `Hiện có ${studentCount} học sinh đã đăng ký tại điểm dừng này. Vui lòng chuyển học sinh trước.`,
        variant: 'deny',
      })
      return
    }

    setSaving(true)
    try {
      const newStatus = currentRow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

      await API_SERVICES.checkpoints.update_status_auto_in_backend(currentRow.id)
      await refreshCheckpoints()
      onOpenChange(false)

      toast({
        title: 'Cập nhật trạng thái thành công',
        description: newStatus === 'ACTIVE' ? 'Điểm dừng đã được kích hoạt.' : 'Điểm dừng đã được dừng hoạt động.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Không thể cập nhật trạng thái.',
        variant: 'deny',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-white dark:bg-[#0f172a] sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Chi tiết điểm dừng {checkpointDetails?.name || 'N/A'}</DialogTitle>
          <DialogDescription>Xem chi tiết và cập nhật trạng thái hoạt động của điểm dừng.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='space-y-4 py-4'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-6 w-2/3' />
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-6 w-1/4' />
          </div>
        ) : checkpointDetails ? (
          <div className='space-y-6 py-4'>
            <table className='w-full overflow-hidden rounded border border-gray-300 text-sm dark:border-gray-600'>
              <tbody>
                <InfoRow label='Tên điểm dừng' value={checkpointDetails.name || 'N/A'} />
                <InfoRow label='Mô tả' value={checkpointDetails.description || 'N/A'} multiline />
                <InfoRow label='Vĩ độ' value={checkpointDetails.latitude || 'N/A'} />
                <InfoRow label='Kinh độ' value={checkpointDetails.longitude || 'N/A'} />
                <InfoRow
                  label='Trạng thái'
                  value={
                    <Status color={checkpointDetails.status === 'ACTIVE' ? 'green' : 'red'} className='inline-flex'>
                      {checkpointDetails.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </Status>
                  }
                />
                <InfoRow label='Số học sinh' value={studentCount ?? 'Đang tải...'} />
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex items-center justify-center p-8'>
            <p className='text-sm text-muted-foreground'>Không có dữ liệu điểm dừng.</p>
          </div>
        )}

        <DialogFooter className='flex flex-row items-center justify-between gap-2'>
          <Button type='button' variant='secondary' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>

          {checkpointDetails && (
            <Button type='button' variant={checkpointDetails.status === 'ACTIVE' ? 'destructive' : 'default'} disabled={saving} onClick={toggleStatus}>
              {checkpointDetails.status === 'ACTIVE' ? 'Dừng hoạt động' : 'Kích hoạt'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value, multiline = false }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <tr className='border-t border-gray-300 dark:border-gray-600'>
      <td className='w-1/3 whitespace-nowrap bg-gray-100 p-2 align-top text-sm font-medium dark:bg-gray-800'>{label}:</td>
      <td className={`p-2 text-sm ${multiline ? 'max-w-[300px] whitespace-pre-wrap break-words' : 'max-w-[300px] whitespace-nowrap break-words'}`}>{value}</td>
    </tr>
  )
}
