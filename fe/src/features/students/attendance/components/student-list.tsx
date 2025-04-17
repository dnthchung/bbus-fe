'use client'

//url : fe/src/features/students/attendance/components/student-list.tsx
import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

// Student type definition
type Student = {
  id: string
  name: string
  studentId: string
  image: string
  busRoute: string
}

// Static student data
const studentsData = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    studentId: 'ST12345',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 01',
  },
  {
    id: '2',
    name: 'Trần Thị Mai',
    studentId: 'ST12346',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 02',
  },
  {
    id: '3',
    name: 'Lê Hoàng Nam',
    studentId: 'ST12347',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 01',
  },
  {
    id: '4',
    name: 'Phạm Đức Minh',
    studentId: 'ST12348',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 03',
  },
  {
    id: '5',
    name: 'Võ Thị Hồng',
    studentId: 'ST12349',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 02',
  },
  {
    id: '6',
    name: 'Đặng Quang Huy',
    studentId: 'ST12350',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 01',
  },
  {
    id: '7',
    name: 'Bùi Thanh Hương',
    studentId: 'ST12351',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 03',
  },
  {
    id: '8',
    name: 'Hoàng Anh Tú',
    studentId: 'ST12352',
    image: '/placeholder.svg?height=40&width=40',
    busRoute: 'Tuyến 02',
  },
]

export default function StudentList() {
  const [selectedStudentId, setSelectedStudentId] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter students based on search query
  const filteredStudents = studentsData.filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || student.busRoute.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className='flex h-full flex-col'>
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <h2 className='flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200'>
          <Users className='h-4 w-4 text-green-600 dark:text-green-500' /> Danh sách học sinh
        </h2>
      </div>
      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500' />
          <Input type='search' placeholder='Tìm kiếm học sinh...' className='h-9 border-gray-200 bg-gray-50 pl-8 text-sm dark:border-gray-700 dark:bg-gray-800' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className='flex-1 overflow-auto'>
        {filteredStudents.length > 0 ? (
          <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
            {filteredStudents.map((student) => (
              <li key={student.id} className={cn('flex cursor-pointer items-center gap-3 p-3 transition-colors', 'hover:bg-gray-50 dark:hover:bg-gray-800/50', selectedStudentId === student.id ? 'border-l-2 border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20' : '')} onClick={() => setSelectedStudentId(student.id)}>
                <Avatar className='h-10 w-10 border border-gray-200 dark:border-gray-700'>
                  <AvatarImage src={student.image} alt={student.name} />
                  <AvatarFallback>
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium dark:text-gray-200'>{student.name}</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>{student.studentId}</p>
                    <span className='text-xs text-green-600 dark:text-green-500'>{student.busRoute}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex h-40 flex-col items-center justify-center p-4 text-center'>
            <Search className='mb-2 h-8 w-8 text-gray-300 dark:text-gray-600' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>Không tìm thấy học sinh</p>
          </div>
        )}
      </div>
      <div className='border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'>{filteredStudents.length} học sinh</div>
    </div>
  )
}
