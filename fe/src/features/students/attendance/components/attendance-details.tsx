'use client'

import { useState } from 'react'
import { Bus, Calendar, Camera, Clock, FileText, Filter, MapPin, User, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample attendance data for bus system with added fields
const attendanceData = [
  {
    id: 1,
    date: '2025-03-20',
    time: '07:15',
    status: 'boarded',
    busRoute: 'Tuyến 01',
    driver: 'Nguyễn Văn A',
    busAttendant: 'Trần Thị B', // Added bus attendant
    location: 'Điểm đón số 3 - Quận 7',
    notes: 'Nhận diện tự động qua camera',
    direction: 'to_school',
    isSuccessful: true, // Added success status
  },
  {
    id: 2,
    date: '2025-03-20',
    time: '16:45',
    status: 'exited',
    busRoute: 'Tuyến 01',
    driver: 'Nguyễn Văn A',
    busAttendant: 'Trần Thị B',
    location: 'Điểm trả số 3 - Quận 7',
    notes: 'Nhận diện tự động qua camera',
    direction: 'from_school',
    isSuccessful: true,
  },
  {
    id: 3,
    date: '2025-03-19',
    time: '07:20',
    status: 'boarded',
    busRoute: 'Tuyến 01',
    driver: 'Nguyễn Văn A',
    busAttendant: 'Lê Văn C',
    location: 'Điểm đón số 3 - Quận 7',
    notes: 'Điểm danh thủ công bởi phụ xe',
    direction: 'to_school',
    isSuccessful: true,
  },
  {
    id: 4,
    date: '2025-03-19',
    time: '16:50',
    status: 'exited',
    busRoute: 'Tuyến 01',
    driver: 'Nguyễn Văn A',
    busAttendant: 'Lê Văn C',
    location: 'Điểm trả số 3 - Quận 7',
    notes: 'Nhận diện tự động qua camera',
    direction: 'from_school',
    isSuccessful: false,
  },
  {
    id: 5,
    date: '2025-03-18',
    time: '07:10',
    status: 'absent',
    busRoute: 'Tuyến 01',
    driver: 'Nguyễn Văn A',
    busAttendant: 'Trần Thị B',
    location: 'Điểm đón số 3 - Quận 7',
    notes: 'Phụ huynh báo nghỉ',
    direction: 'to_school',
    isSuccessful: false,
  },
]

export default function AttendanceDetails() {
  const [filter, setFilter] = useState('all')

  // Filter attendance records based on selected filter
  const filteredAttendance =
    filter === 'all'
      ? attendanceData
      : attendanceData.filter((record) => {
          if (filter === 'to_school') return record.direction === 'to_school'
          if (filter === 'from_school') return record.direction === 'from_school'
          return record.status === filter
        })

  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'boarded':
        return <Badge className='bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/30'>Lên xe</Badge>
      case 'exited':
        return <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30'>Xuống xe</Badge>
      case 'absent':
        return <Badge className='bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/30'>Vắng mặt</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  // Get success status indicator
  const getSuccessStatus = (isSuccessful: boolean) => {
    if (isSuccessful) {
      return (
        <div className='mt-1 flex items-center text-xs text-green-600 dark:text-green-400'>
          <CheckCircle className='mr-1 h-3 w-3' />
          <span>Đã thành công</span>
        </div>
      )
    } else {
      return (
        <div className='mt-1 flex items-center text-xs text-red-600 dark:text-red-400'>
          <XCircle className='mr-1 h-3 w-3' />
          <span>Chưa thành công</span>
        </div>
      )
    }
  }

  // Get direction text
  const getDirectionText = (direction: string) => {
    return direction === 'to_school' ? 'Đi đến trường' : 'Về từ trường'
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <h3 className='text-lg font-semibold'>Sammah Nguyen</h3>
        <div className='flex items-center gap-2'>
          <Select defaultValue='all' onValueChange={setFilter}>
            <SelectTrigger className='h-9 w-[180px]'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4' />
                <SelectValue placeholder='Lọc trạng thái' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='to_school'>Đi đến trường</SelectItem>
              <SelectItem value='from_school'>Về từ trường</SelectItem>
              <SelectItem value='boarded'>Lên xe</SelectItem>
              <SelectItem value='exited'>Xuống xe</SelectItem>
              <SelectItem value='absent'>Vắng mặt</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm' className='h-9'>
            <FileText className='mr-2 h-4 w-4' />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue='list' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='list'>Danh sách</TabsTrigger>
          <TabsTrigger value='summary'>Tổng quan</TabsTrigger>
        </TabsList>
        <TabsContent value='list' className='space-y-4'>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record) => (
              <Card key={record.id} className='overflow-hidden'>
                <CardHeader className='p-4 pb-2'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-base'>{getDirectionText(record.direction)}</CardTitle>
                      <p className='text-sm text-muted-foreground'>{record.busRoute}</p>
                    </div>
                    <div className='flex flex-col items-end'>
                      {getStatusBadge(record.status)}
                      {record.status !== 'absent' && getSuccessStatus(record.isSuccessful)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-4 pt-2'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <span>{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <span>{record.time}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Bus className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <span>Lái xe: {record.driver}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <User className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <span>Phụ xe: {record.busAttendant}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <MapPin className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <span>{record.location}</span>
                    </div>
                  </div>
                  {record.notes && (
                    <div className='mt-2 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300'>
                      <Camera className='mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
                      <p>{record.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Bus className='mb-4 h-12 w-12 text-gray-300 dark:text-gray-600' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>Không có dữ liệu</h3>
              <p className='mt-1 text-gray-500 dark:text-gray-400'>Không tìm thấy dữ liệu điểm danh phù hợp với bộ lọc.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value='summary'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>Tổng số chuyến đi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{attendanceData.length}</div>
                <p className='text-xs text-muted-foreground'>Trong 30 ngày qua</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>Tỷ lệ nhận diện tự động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>{Math.round((attendanceData.filter((r) => r.notes.includes('tự động')).length / attendanceData.length) * 100)}%</div>
                <div className='mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700'>
                  <div
                    className='h-full rounded-full bg-green-500 dark:bg-green-600'
                    style={{
                      width: `${(attendanceData.filter((r) => r.notes.includes('tự động')).length / attendanceData.length) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>Tỷ lệ vắng mặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600 dark:text-red-400'>{Math.round((attendanceData.filter((r) => r.status === 'absent').length / attendanceData.length) * 100)}%</div>
                <div className='mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700'>
                  <div
                    className='h-full rounded-full bg-red-500 dark:bg-red-600'
                    style={{
                      width: `${(attendanceData.filter((r) => r.status === 'absent').length / attendanceData.length) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className='mt-4'>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin về hệ thống BBus</CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>
              <p className='mb-2'>Hệ thống BBus là giải pháp quản lý vận chuyển và điểm danh học sinh tự động, sử dụng hệ thống camera tích hợp công nghệ AI được lắp đặt trên xe buýt đưa đón học sinh.</p>
              <p className='mb-2'>Hệ thống tự động hóa hoàn toàn việc điểm danh và theo dõi chính xác quá trình lên/xuống xe của từng học sinh, đảm bảo không xảy ra tình trạng bỏ quên hoặc sót học sinh trên xe thông qua công nghệ tracking tự động.</p>
              <p>Bên cạnh đó, giải pháp còn giúp giảm tải đáng kể công việc điểm danh thủ công của giáo viên phụ trách. Hệ thống bao gồm admin panel để quản lý vận hành tổng thể và ứng dụng di động dành cho phụ huynh, nhà xe, giáo viên, qua đó nâng cao hiệu quả quản lý, minh bạch hóa thông tin và đảm bảo an toàn tối đa cho học sinh trong suốt quá trình di chuyển.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
