//path : fe/src/features/buses/list/components/buses-primary-buttons.tsx
import { IconTableDown, IconBus } from '@tabler/icons-react'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBuses } from '@/features/buses/context/buses-context'

export function BusesPrimaryButtons() {
  const { setOpen } = useBuses()

  return (
    <div className='flex gap-2'>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
        <span>Nhập danh sách xe buýt</span>
        <IconTableDown size={18} />
      </Button>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm xe buýt mới</span>
        <IconBus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('change-student-capacity')}>
        <span>Thay đổi SL học sinh</span>
        <User size={18} />
      </Button>
    </div>
  )
}
