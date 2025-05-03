'use client'

import { JSX, useEffect, useMemo, useState } from 'react'
import { Bus, Calendar, Camera, CheckCircle, Clock, Filter, MapPin, User, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStudentHistoryStudentId } from '../functions'
import { useAttendanceStore } from '../stores/attendance-store'

// function formatVietnamTime(utcString: string | null): string {
//   if (!utcString) return 'Trống'
//   const date = new Date(utcString)
//   return new Intl.DateTimeFormat('vi-VN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     timeZone: 'Asia/Ho_Chi_Minh',
//     hour12: false,
//   }).format(date)
// }

function formatVietnamTime(utcString: string | null): JSX.Element | string {
  if (!utcString) {
    return <span className='italic text-muted-foreground text-red-500'>Trống</span>
  }

  const date = new Date(utcString)
  const formatted = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  }).format(date)

  return formatted
}

type RawRecord = {
  id: string
  date: string
  direction: 'PICK_UP' | 'DROP_OFF'
  status: 'IN_BUS' | 'ABSENT' | 'ATTENDED'
  checkin: string | null
  checkout: string | null
  routeCode: string
  driverName: string
  assistantName: string
  checkpointName: string
  modifiedBy: string | null
}
const mapRecord = (
  r: RawRecord
): {
  id: string
  date: string
  status: RawRecord['status']
  busRoute: string
  driver: string
  busAttendant: string
  location: string
  notes: string
  direction: 'to_school' | 'from_school' // 👈 Khai báo rõ
  isSuccessful: boolean
  checkin: string | null
  checkout: string | null
} => ({
  id: r.id,
  date: r.date,
  status: r.status,
  busRoute: r.routeCode,
  driver: r.driverName,
  busAttendant: r.assistantName,
  location: r.checkpointName,
  notes: r.modifiedBy ?? '',
  direction: r.direction === 'PICK_UP' ? 'to_school' : 'from_school',
  isSuccessful: r.status !== 'ABSENT',
  checkin: r.checkin,
  checkout: r.checkout,
})

export default function AttendanceDetails() {
  const { selectedStudentId } = useAttendanceStore()
  const [filter, setFilter] = useState('all')
  const [records, setRecords] = useState<ReturnType<typeof mapRecord>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedStudentId) return
    ;(async () => {
      setLoading(true)
      const raw = await getStudentHistoryStudentId(selectedStudentId)
      setRecords(raw.map(mapRecord))
      setLoading(false)
    })()
  }, [selectedStudentId])

  const filtered = useMemo(() => {
    if (filter === 'all') return records
    if (filter === 'to_school') return records.filter((r) => r.direction === 'to_school')
    if (filter === 'from_school') return records.filter((r) => r.direction === 'from_school')
    return records.filter((r) => r.status === filter.toUpperCase())
  }, [records, filter])

  const badge = (status: RawRecord['status']) => {
    const statusLabels: Record<RawRecord['status'], string> = {
      ABSENT: 'Vắng mặt',
      ATTENDED: 'Đã đến',
      IN_BUS: 'Đang trên xe',
    }

    const colorMap: Record<RawRecord['status'], string> = {
      ABSENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      ATTENDED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      IN_BUS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    }

    return <Badge className={colorMap[status]}>{statusLabels[status]}</Badge>
  }

  const success = (ok: boolean, direction: 'to_school' | 'from_school') =>
    ok ? (
      <div className='mt-1 flex items-center text-xs text-green-600 dark:text-green-400'>
        <CheckCircle className='mr-1 h-3 w-3' />
        <span>{direction === 'to_school' ? 'Đã đến' : 'Đã về'}</span>
      </div>
    ) : (
      <div className='mt-1 flex items-center text-xs text-red-600 dark:text-red-400'>
        <XCircle className='mr-1 h-3 w-3' />
        <span>Chưa thành công</span>
      </div>
    )

  const dirText = (d: string) => (d === 'to_school' ? 'Đi đến trường' : 'Về từ trường')

  if (!selectedStudentId) return <p className='p-4 text-sm text-gray-500'>Chọn học sinh để xem lịch sử</p>

  return (
    <div className='space-y-4'>
      <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <h3 className='text-lg font-semibold'>Lịch sử điểm danh</h3>
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
              <SelectItem value='ATTENDED'>Đã đến</SelectItem>
              <SelectItem value='IN_BUS'>Đang trên xe</SelectItem>
              <SelectItem value='ABSENT'>Vắng mặt</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm' className='h-9'>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue='list'>
        <TabsList className='mb-4'>
          <TabsTrigger value='list'>Danh sách</TabsTrigger>
          <TabsTrigger value='summary'>Tổng quan</TabsTrigger>
        </TabsList>

        <TabsContent value='list'>
          {loading ? (
            <p className='py-8 text-center text-sm text-gray-500'>Đang tải...</p>
          ) : filtered.length ? (
            <div className='space-y-4'>
              {filtered.map((r) => (
                <Card key={r.id}>
                  <CardHeader className='p-4 pb-2'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='text-base'>{dirText(r.direction)}</CardTitle>
                        <p className='text-sm text-muted-foreground'>{r.busRoute}</p>
                      </div>
                      <div className='flex flex-col items-end'>
                        {badge(r.status)}
                        {r.status !== 'ABSENT' && success(r.isSuccessful, r.direction)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-4 pt-2'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      {/* Left */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Calendar className='h-4 w-4' />
                          <span>{new Date(r.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Bus className='h-4 w-4' />
                          <span>Lái xe: {r.driver}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <MapPin className='h-4 w-4' />
                          <span>{r.location}</span>
                        </div>
                      </div>
                      {/* Right */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Clock className='h-4 w-4' />
                          <span>Giờ lên xe: {formatVietnamTime(r.checkin)}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Clock className='h-4 w-4' />
                          <span>Giờ xuống xe: {formatVietnamTime(r.checkout)}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <User className='h-4 w-4' />
                          <span>Phụ xe: {r.busAttendant}</span>
                        </div>
                      </div>
                    </div>
                    {r.notes && (
                      <div className='mt-2 flex items-start gap-2 text-sm'>
                        <Camera className='mt-0.5 h-4 w-4' />
                        <p>{r.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Bus className='mb-4 h-12 w-12 text-gray-300' />
              <p className='text-lg font-medium'>Không có dữ liệu</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value='summary'>
          <p className='text-sm text-gray-500'>Tính năng sẽ bổ sung sau…</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
