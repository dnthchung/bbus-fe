//path : fe/src/features/buses/list/components/page/page-view-details.tsx
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useBuses } from '../../../context/buses-context'

export default function PageViewDetails() {
  const { open, setOpen, currentRow } = useBuses()

  if (!currentRow) return null

  return (
    <Dialog open={open === 'view-edit-details'} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết xe buýt</DialogTitle>
        </DialogHeader>

        <Separator className='my-2' />

        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='font-semibold'>Tên xe:</p>
              <p>{currentRow.name}</p>
            </div>

            <div>
              <p className='font-semibold'>Biển số xe:</p>
              <p>{currentRow.licensePlate}</p>
            </div>

            <div>
              <p className='font-semibold'>Tài xế:</p>
              <p>{currentRow.driverName}</p>
            </div>

            <div>
              <p className='font-semibold'>Tuyến đường:</p>
              <p>{currentRow.route}</p>
            </div>

            <div>
              <p className='font-semibold'>ESP ID:</p>
              <Badge variant='secondary'>{currentRow.espId}</Badge>
            </div>

            <div>
              <p className='font-semibold'>Camera ID:</p>
              <Badge variant='secondary'>{currentRow.cameraFacesluice}</Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
