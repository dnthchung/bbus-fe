'use client'

import { useEffect, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getAllStudent } from '../functions'
import { useAttendanceStore } from '../stores/attendance-store'

// Kiểu dữ liệu
interface Student {
  id: string
  name: string
  rollNumber: string
  avatar: string
  busName: string // trả về luôn "Chưa có xe" hoặc "Bus 001"
  busId: string | null
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
      setStudents(data) // không cần map lại busName
      setLoading(false)
    })()
  }, [])

  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase()) || s.busName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <h2 className='flex items-center gap-2 text-sm font-semibold'>
          <Users className='h-4 w-4 text-green-600' />
          Danh sách học sinh
        </h2>
      </div>

      {/* Tìm kiếm */}
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
          <Input type='search' placeholder='Tìm kiếm học sinh...' className='h-9 border-gray-200 bg-gray-50 pl-8 text-sm dark:bg-gray-900' value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Danh sách học sinh */}
      <div className='flex-1 overflow-auto'>
        {loading ? (
          <p className='p-4 text-sm text-gray-500'>Đang tải...</p>
        ) : filtered.length ? (
          <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
            {filtered.map((st) => (
              <li key={st.id} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50', selectedStudentId === st.id && 'border-l-2 border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20')} onClick={() => selectStudent(st.id)}>
                <Avatar className='h-10 w-10 border border-gray-200 dark:border-gray-700'>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className='cursor-default text-xs text-gray-500'>{st.rollNumber.length > 10 ? `${st.rollNumber.slice(0, 10)}...` : st.rollNumber}</p>
                        </TooltipTrigger>
                        <TooltipContent>{st.rollNumber}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <span className={cn('text-xs font-medium', st.busName === 'Chưa có xe' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')}>{st.busName}</span>
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

      {/* Footer */}
      <div className='border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900'>{filtered.length} học sinh</div>
    </div>
  )
}
