import { IconTableDown, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCheckpoints } from '../context/checkpoints-context'

export function CheckpointsPrimaryButtons() {
  const { setOpen } = useCheckpoints()
  return (
    <div className='flex gap-2'>
      {/* <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
        <span>Nhập DS điểm dừng</span>
        <IconTableDown size={18} />
      </Button> */}
      {/* <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm điểm dừng mới</span>
        <IconUserPlus size={18} />
      </Button> */}
    </div>
  )
}
