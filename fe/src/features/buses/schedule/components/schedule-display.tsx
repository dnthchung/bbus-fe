'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data - replace with actual API calls
const busSchedules = [
  {
    id: 'bus-001',
    busNumber: 'B001',
    licensePlate: '51F-12345',
    driver: 'Nguyễn Văn A',
    driverPhone: '0901234567',
    route: 'Tuyến 1: Quận 1 - Trường Học',
    capacity: 40,
    currentOccupancy: 32,
    schedule: [
      { id: 's1', time: '06:30', checkpoint: 'Điểm đón Quận 1', type: 'pickup', status: 'completed' },
      { id: 's2', time: '06:45', checkpoint: 'Điểm đón Quận 3', type: 'pickup', status: 'completed' },
      { id: 's3', time: '07:15', checkpoint: 'Trường Học', type: 'dropoff', status: 'in-progress' },
      { id: 's4', time: '16:00', checkpoint: 'Trường Học', type: 'pickup', status: 'scheduled' },
      { id: 's5', time: '16:30', checkpoint: 'Điểm trả Quận 3', type: 'dropoff', status: 'scheduled' },
      { id: 's6', time: '16:45', checkpoint: 'Điểm trả Quận 1', type: 'dropoff', status: 'scheduled' },
    ],
  },
  {
    id: 'bus-002',
    busNumber: 'B002',
    licensePlate: '51F-54321',
    driver: 'Trần Văn B',
    driverPhone: '0907654321',
    route: 'Tuyến 2: Quận 7 - Trường Học',
    capacity: 35,
    currentOccupancy: 30,
    schedule: [
      { id: 's7', time: '06:15', checkpoint: 'Điểm đón Quận 7', type: 'pickup', status: 'completed' },
      { id: 's8', time: '06:35', checkpoint: 'Điểm đón Quận 4', type: 'pickup', status: 'completed' },
      { id: 's9', time: '07:10', checkpoint: 'Trường Học', type: 'dropoff', status: 'completed' },
      { id: 's10', time: '16:00', checkpoint: 'Trường Học', type: 'pickup', status: 'scheduled' },
      { id: 's11', time: '16:25', checkpoint: 'Điểm trả Quận 4', type: 'dropoff', status: 'scheduled' },
      { id: 's12', time: '16:50', checkpoint: 'Điểm trả Quận 7', type: 'dropoff', status: 'scheduled' },
    ],
  },
  {
    id: 'bus-003',
    busNumber: 'B003',
    licensePlate: '51F-67890',
    driver: 'Lê Thị C',
    driverPhone: '0903456789',
    route: 'Tuyến 3: Quận 2 - Trường Học',
    capacity: 40,
    currentOccupancy: 38,
    schedule: [
      { id: 's13', time: '06:00', checkpoint: 'Điểm đón Quận 2', type: 'pickup', status: 'completed' },
      { id: 's14', time: '06:20', checkpoint: 'Điểm đón Thủ Đức', type: 'pickup', status: 'completed' },
      { id: 's15', time: '07:00', checkpoint: 'Trường Học', type: 'dropoff', status: 'completed' },
      { id: 's16', time: '16:00', checkpoint: 'Trường Học', type: 'pickup', status: 'scheduled' },
      { id: 's17', time: '16:40', checkpoint: 'Điểm trả Thủ Đức', type: 'dropoff', status: 'scheduled' },
      { id: 's18', time: '17:00', checkpoint: 'Điểm trả Quận 2', type: 'dropoff', status: 'scheduled' },
    ],
  },
]

export default function ScheduleDisplay() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewType, setViewType] = useState('list') // list or timeline
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredBuses = busSchedules.filter((bus) => bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) || bus.route.toLowerCase().includes(searchQuery.toLowerCase()) || bus.driver.toLowerCase().includes(searchQuery.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant='outline' className='bg-green-100 text-green-800'>
            Hoàn thành
          </Badge>
        )
      case 'in-progress':
        return (
          <Badge variant='outline' className='bg-blue-100 text-blue-800'>
            Đang thực hiện
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge variant='outline' className='bg-gray-100 text-gray-800'>
            Lên lịch
          </Badge>
        )
      default:
        return <Badge variant='outline'>Không xác định</Badge>
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <h1 className='text-2xl font-bold'>Lịch Chạy Xe</h1>

          <div className='flex w-full flex-col gap-2 sm:flex-row md:w-auto'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full justify-start sm:w-auto'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {format(selectedDate, 'dd/MM/yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <CalendarComponent mode='single' selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
              </PopoverContent>
            </Popover>

            <div className='relative w-full sm:w-[300px]'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input type='search' placeholder='Tìm kiếm xe, tuyến, tài xế...' className='w-full pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-between gap-4 md:flex-row'>
          <Tabs defaultValue='all' className='w-full md:w-auto'>
            <TabsList>
              <TabsTrigger value='all' onClick={() => setFilterStatus('all')}>
                Tất cả
              </TabsTrigger>
              <TabsTrigger value='in-progress' onClick={() => setFilterStatus('in-progress')}>
                Đang chạy
              </TabsTrigger>
              <TabsTrigger value='scheduled' onClick={() => setFilterStatus('scheduled')}>
                Lên lịch
              </TabsTrigger>
              <TabsTrigger value='completed' onClick={() => setFilterStatus('completed')}>
                Hoàn thành
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex items-center gap-2'>
            <Select defaultValue={viewType} onValueChange={setViewType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Kiểu hiển thị' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='list'>Danh sách</SelectItem>
                <SelectItem value='timeline'>Dòng thời gian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {viewType === 'list' ? (
            filteredBuses.map((bus) => (
              <Card key={bus.id} className='overflow-hidden'>
                <CardHeader className='bg-muted/50 pb-2'>
                  <div className='flex flex-col justify-between gap-2 md:flex-row md:items-center'>
                    <div>
                      <CardTitle className='flex items-center gap-2'>
                        <span className='text-lg'>{bus.busNumber}</span>
                        <Badge variant='outline' className='ml-2'>
                          {bus.licensePlate}
                        </Badge>
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>{bus.route}</p>
                    </div>
                    <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
                      <div className='text-sm'>
                        <span className='text-muted-foreground'>Tài xế:</span> {bus.driver} ({bus.driverPhone})
                      </div>
                      <div className='text-sm'>
                        <span className='text-muted-foreground'>Sức chứa:</span> {bus.currentOccupancy}/{bus.capacity}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-4'>
                  <ScrollArea className='h-[250px] pr-4'>
                    <div className='space-y-4'>
                      {bus.schedule.map((stop, index) => (
                        <div key={stop.id} className='relative pl-8'>
                          {index < bus.schedule.length - 1 && <div className={`absolute left-3 top-5 -ml-px h-full w-0.5 ${getStatusColor(stop.status)}`} />}
                          <div className='flex items-start gap-4'>
                            <div className={`absolute left-0 flex h-6 w-6 items-center justify-center rounded-full ${getStatusColor(stop.status)}`}>
                              <Clock className='h-3 w-3' />
                            </div>
                            <div className='flex-1'>
                              <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
                                <div>
                                  <p className='font-medium'>{stop.checkpoint}</p>
                                  <p className='text-sm text-muted-foreground'>{stop.type === 'pickup' ? 'Điểm đón' : 'Điểm trả'}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-medium'>{stop.time}</span>
                                  {getStatusBadge(stop.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Dòng thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='relative'>
                  <div className='absolute left-0 h-full w-px bg-border'></div>
                  <div className='ml-6 space-y-8'>
                    {Array.from(new Set(filteredBuses.flatMap((bus) => bus.schedule.map((stop) => stop.time))))
                      .sort()
                      .map((time) => (
                        <div key={time} className='relative'>
                          <div className='absolute -left-6 mt-1 h-4 w-4 rounded-full bg-primary'></div>
                          <div className='font-medium'>{time}</div>
                          <div className='mt-2 space-y-3'>
                            {filteredBuses
                              .map((bus) => {
                                const stopsAtTime = bus.schedule.filter((stop) => stop.time === time)
                                if (stopsAtTime.length === 0) return null

                                return (
                                  <div key={`${bus.id}-${time}`} className='rounded-md bg-muted/50 p-3'>
                                    <div className='flex items-center justify-between'>
                                      <div className='font-medium'>
                                        {bus.busNumber} - {bus.licensePlate}
                                      </div>
                                      <Badge variant='outline'>{bus.route.split(':')[0]}</Badge>
                                    </div>
                                    <div className='mt-2 space-y-2'>
                                      {stopsAtTime.map((stop) => (
                                        <div key={stop.id} className='flex items-center justify-between'>
                                          <div>
                                            {stop.checkpoint} ({stop.type === 'pickup' ? 'Đón' : 'Trả'})
                                          </div>
                                          {getStatusBadge(stop.status)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })
                              .filter(Boolean)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
