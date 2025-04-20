// path: fe/src/features/users/components/UsersPrimaryButtons.tsx
import { useNavigate } from '@tanstack/react-router'
import { IconRoute, IconRoute2, IconTableDown, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRoutes } from '../context/routes-context'

export function RoutesPrimaryButtons() {
  const { setOpen } = useRoutes()
  const navigate = useNavigate()

  return (
    <div className='flex gap-2'>
      {/* <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
        <span>Nhập DS tuyến đường</span>
        <IconTableDown size={18} />
      </Button> */}
      <Button className='space-x-1' onClick={() => navigate({ to: '/transportation/routes/add' })}>
        <span>Thêm tuyến đường mới</span>
        <IconRoute2 size={18} />
      </Button>
    </div>
  )
}
