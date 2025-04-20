'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getStudentsByBusId } from '@/features/buses/buses'

// Define Student interface based on the provided schema
interface Parent {
  userId: string
  username: string
  name: string
  gender: string
  dob: string
  email: string
  avatar: string
  phone: string
  address: string
  status: string
  role: string
}

interface Student {
  id: string
  rollNumber: string
  name: string
  avatar: string
  dob: string
  address: string
  gender: string
  status: string
  parentId: string
  busId: string
  busName: string
  parent: Parent
  checkpointId: string
  checkpointName: string
  checkpointDescription: string
}

export default function PageViewStudentListDetails() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [studentList, setStudentList] = useState<Student[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const studentListData = await getStudentsByBusId(id ?? '')
        setStudentList(studentListData)
        setError(null)
      } catch (err) {
        console.error('Error fetching student list:', err)
        setError(err instanceof Error ? err : new Error('Không thể tải danh sách học sinh'))
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách học sinh',
          variant: 'deny',
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleBack = () => {
    navigate({ to: '/buses/list' })
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6'>
          <Button variant='outline' size='sm' onClick={handleBack}>
            <ArrowLeftIcon className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>

        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Danh sách học sinh</h1>
          <p className='text-muted-foreground'>Danh sách học sinh của xe buýt </p>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-10'>
            <Loader2 className='h-10 w-10 animate-spin text-primary' />
          </div>
        ) : error ? (
          <Card>
            <CardContent className='py-10 text-center'>
              <div className='text-destructive'>
                <p className='text-lg font-semibold'>Đã xảy ra lỗi</p>
                <p>{error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã số</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Giới tính</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tên phụ huynh</TableHead>
                      <TableHead>Điểm đón</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentList.length > 0 ? (
                      studentList.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.address}</TableCell>
                          <TableCell>{student.status}</TableCell>
                          <TableCell>{student.parent?.name || 'N/A'}</TableCell>
                          <TableCell>{student.checkpointName || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className='py-6 text-center'>
                          Không tìm thấy học sinh nào cho xe buýt này
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
