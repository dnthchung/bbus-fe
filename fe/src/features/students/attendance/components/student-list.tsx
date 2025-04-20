'use client'

import { useEffect, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getAllStudent } from '../functions'
import { useAttendanceStore } from '../stores/attendance-store'

// Kiểu dữ liệu khớp API
interface Student {
  id: string
  name: string
  rollNumber: string // mã HS
  avatar: string
  busName: string | null // tên tuyến nếu backend trả về
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const { selectedStudentId, selectStudent } = useAttendanceStore()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const data = await getAllStudent()
      // map nhỏ: busName → 'Tuyến ...' cho giống UI cũ
      const mapped = data.map((s) => ({
        ...s,
        busName: s.busName ?? '---',
      }))
      setStudents(mapped)
      setLoading(false)
    })()
  }, [])

  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase()) || (s.busName ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='flex h-full flex-col'>
      {/* header */}
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <h2 className='flex items-center gap-2 text-sm font-semibold'>
          <Users className='h-4 w-4 text-green-600' />
          Danh sách học sinh
        </h2>
      </div>

      {/* tìm kiếm */}
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
          <Input type='search' placeholder='Tìm kiếm học sinh...' className='h-9 border-gray-200 bg-gray-50 pl-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* danh sách */}
      <div className='flex-1 overflow-auto'>
        {loading ? (
          <p className='p-4 text-sm text-gray-500'>Đang tải...</p>
        ) : filtered.length ? (
          <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
            {filtered.map((st) => (
              <li key={st.id} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50', selectedStudentId === st.id && 'border-l-2 border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20')} onClick={() => selectStudent(st.id)}>
                <Avatar className='h-10 w-10 border border-gray-200'>
                  <AvatarImage src={st.avatar} alt={st.name} />
                  <AvatarFallback>
                    {st.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className='text-sm font-medium'>{st.name}</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-xs text-gray-500'>{st.rollNumber}</p>
                    <span className='text-xs text-green-600'>{st.busName === '---' ? 'chưa có bus' : st.busName}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex h-40 items-center justify-center'>
            <p className='text-sm text-gray-500'>Không tìm thấy học sinh</p>
          </div>
        )}
      </div>

      {/* footer đếm số HS */}
      <div className='border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-500'>{filtered.length} học sinh</div>
    </div>
  )
}
