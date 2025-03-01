// import { IconTableDown, IconUserPlus } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import { useUsers } from '../context/users-context'
// export function UsersPrimaryButtons() {
//   const { setOpen } = useUsers()
//   return (
//     <div className='flex gap-2'>
//       <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
//         <span>Nhập DS người dùng </span> <IconTableDown size={18} />
//       </Button>
//       <Button className='space-x-1' onClick={() => setOpen('add')}>
//         <span>Thêm người dùng mới</span> <IconUserPlus size={18} />
//       </Button>
//     </div>
//   )
// }
// path: fe/src/features/users/components/UsersPrimaryButtons.tsx
import { IconTableDown, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useStudents } from '../context/students-context'

export function StudentsPrimaryButtons() {
  const { setOpen } = useStudents()

  return (
    <div className='flex gap-2'>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
        <span>Nhập DS học sinh</span>
        <IconTableDown size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Thêm học sinh mới</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
