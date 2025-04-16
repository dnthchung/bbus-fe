'use client'

import { useState, useEffect } from 'react'
import type { BusStop, Bus, Student } from '@/types/bus'
import { BusIcon, Users, MapPin, AlertCircle, CheckCircle2, Clock, Loader2, Eye, Route } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCheckpointsInARouteByBusId, getCheckpointDetailByCheckpointId } from '@/features/transportation/function'

interface RightPanelProps {
  buses: Bus[]
  students: Student[]
  selectedCheckpoint: BusStop | null
  selectedBus: Bus | null
  onSelectBus: (bus: Bus | null) => void
  onRegisterStudent: (studentId: string, busId: string) => void
  isLoadingBuses: boolean
  isLoadingStudents: boolean
}

export default function RightPanel({ buses, students, selectedCheckpoint, selectedBus, onSelectBus, onRegisterStudent, isLoadingBuses, isLoadingStudents }: RightPanelProps) {
  const { toast } = useToast()
  const [routeCheckpoints, setRouteCheckpoints] = useState<BusStop[]>([])
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [busActiveTab, setBusActiveTab] = useState('buses')
  const [hasRouteData, setHasRouteData] = useState(false)

  // Calculate statistics for the selected bus
  const getBusStats = (bus: Bus) => {
    const totalCapacity = bus.capacity || 30
    const registeredCount = bus.registeredCount || 0
    const availableSeats = totalCapacity - registeredCount
    const fillPercentage = (registeredCount / totalCapacity) * 100

    return {
      totalCapacity,
      registeredCount,
      availableSeats,
      fillPercentage,
    }
  }

  // Group students by status
  const groupedStudents = {
    registered: students.filter((s) => s.status === 'registered'),
    waiting: students.filter((s) => s.status === 'waiting'),
  }

  // Fetch route checkpoints when a bus is selected
  useEffect(() => {
    if (selectedBus) {
      fetchRouteCheckpoints(selectedBus.id)
    } else {
      setRouteCheckpoints([])
      setHasRouteData(false)
      setBusActiveTab('buses')
    }
  }, [selectedBus])

  // Fetch route checkpoints for a bus
  const fetchRouteCheckpoints = async (busId: string) => {
    setIsLoadingRoute(true)
    try {
      const routeData = await getCheckpointsInARouteByBusId(busId)

      // Split the string of checkpoint IDs into an array
      const checkpointIds = routeData.split(' ')

      // Fetch details for each checkpoint
      const checkpointsDetails = await Promise.all(
        checkpointIds.map(async (id: string) => {
          try {
            const checkpointDetail = await getCheckpointDetailByCheckpointId(id)
            return {
              id: checkpointDetail.id,
              name: checkpointDetail.name,
              description: checkpointDetail.description,
              lat: Number.parseFloat(checkpointDetail.latitude),
              lng: Number.parseFloat(checkpointDetail.longitude),
              status: checkpointDetail.status,
              studentCount: 0, // We don't have this information here
            }
          } catch (error) {
            console.error(`Error fetching details for checkpoint ${id}:`, error)
            return null
          }
        })
      )

      // Filter out any null values (failed fetches)
      const validCheckpoints = checkpointsDetails.filter(Boolean) as BusStop[]
      setRouteCheckpoints(validCheckpoints)
      setHasRouteData(validCheckpoints.length > 0)

      if (validCheckpoints.length === 0) {
        toast({
          title: 'Không có dữ liệu tuyến đường',
          description: 'Không tìm thấy thông tin về các trạm dừng trong tuyến đường này',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(`Error fetching route for bus ${busId}:`, error)
      setRouteCheckpoints([])
      setHasRouteData(false)
      toast({
        title: 'Lỗi tải dữ liệu',
        description: 'Không thể tải thông tin tuyến đường. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingRoute(false)
    }
  }

  return (
    <div className='flex h-full w-96 flex-col border-l'>
      <div className='flex h-1/2 flex-col border-b'>
        <Tabs value={busActiveTab} onValueChange={setBusActiveTab} className='flex h-full flex-col'>
          <div className='border-b px-4 py-2'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='font-medium'>{selectedCheckpoint ? `Xe buýt tại ${selectedCheckpoint.name}` : 'Xe buýt'}</h3>
              {selectedBus && (
                <Button variant='ghost' size='sm' className='h-8 px-2' onClick={() => (window.location.href = `/buses/list/${selectedBus.id}`)}>
                  <Eye className='mr-1 h-4 w-4' />
                  Xem chi tiết
                </Button>
              )}
            </div>

            <TabsList className='w-full'>
              <TabsTrigger value='buses' className='flex-1'>
                <BusIcon className='mr-2 h-4 w-4' />
                Danh sách xe buýt
              </TabsTrigger>
              <TabsTrigger
                value='route'
                className='flex-1'
                disabled={!hasRouteData}
                onClick={() => {
                  if (!hasRouteData && selectedBus) {
                    toast({
                      title: 'Không có dữ liệu tuyến đường',
                      description: 'Không tìm thấy thông tin về các trạm dừng trong tuyến đường này',
                      variant: 'destructive',
                    })
                  }
                }}
              >
                <Route className='mr-2 h-4 w-4' />
                Tuyến đường
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='buses' className='flex-1 overflow-hidden p-0'>
            {isLoadingBuses ? (
              <div className='flex h-full items-center justify-center'>
                <div className='flex flex-col items-center gap-2'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  <p className='text-sm text-muted-foreground'>Đang tải xe buýt...</p>
                </div>
              </div>
            ) : selectedCheckpoint ? (
              buses.length > 0 ? (
                <ScrollArea className='h-[calc(100%-1px)]'>
                  {buses.map((bus) => {
                    const stats = getBusStats(bus)

                    return (
                      <div key={bus.id} className={`flex cursor-pointer flex-col border-b p-3 transition-colors hover:bg-muted/50 ${selectedBus?.id === bus.id ? 'bg-muted' : ''}`} onClick={() => onSelectBus(bus)}>
                        <div className='flex items-center'>
                          <div className='mr-3 text-primary'>
                            <BusIcon size={18} />
                          </div>
                          <div className='flex-1'>
                            <div className='font-medium'>{bus.name}</div>
                            <div className='text-xs text-muted-foreground'>{bus.licensePlate}</div>
                            <div className='text-sm text-muted-foreground'>
                              {stats.registeredCount}/{stats.totalCapacity} học sinh
                            </div>
                          </div>

                          <div className='flex items-center gap-2'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                              title='Xem chi tiết'
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `buses/list/${bus.id}`
                              }}
                            >
                              <Eye size={16} />
                            </Button>

                            {stats.availableSeats === 0 ? (
                              <Badge variant='secondary' className='bg-red-50 text-red-700'>
                                Đầy
                              </Badge>
                            ) : stats.fillPercentage > 80 ? (
                              <Badge variant='secondary' className='bg-yellow-50 text-yellow-700'>
                                Gần đầy
                              </Badge>
                            ) : (
                              <Badge variant='secondary' className='bg-green-50 text-green-700'>
                                {stats.availableSeats} Chỗ trống
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className='mt-2'>
                          <Progress value={stats.fillPercentage} className='h-2' />
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              ) : (
                <div className='flex h-full items-center justify-center p-4 text-muted-foreground'>
                  <div className='flex flex-col items-center gap-2'>
                    <AlertCircle className='h-5 w-5' />
                    <p>Không có xe buýt đi qua trạm dừng này</p>
                  </div>
                </div>
              )
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>
                <div className='flex flex-col items-center gap-2'>
                  <BusIcon className='h-6 w-6' />
                  <p>Chọn một trạm dừng để xem xe buýt</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value='route' className='flex-1 overflow-hidden p-0'>
            {selectedBus ? (
              isLoadingRoute ? (
                <div className='flex h-full items-center justify-center'>
                  <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary' />
                    <p className='text-sm text-muted-foreground'>Đang tải tuyến đường...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className='border-b px-4 py-2'>
                    <h4 className='text-sm font-medium'>Các trạm dừng mà {selectedBus.name} đi qua</h4>
                    <p className='text-xs text-muted-foreground'>{routeCheckpoints.length} trạm dừng trong tuyến</p>
                  </div>
                  <div className='h-[calc(100%-41px)] overflow-auto'>
                    {routeCheckpoints.length > 0 ? (
                      routeCheckpoints.map((checkpoint, index) => (
                        <div key={checkpoint.id} className='flex items-center border-b p-3'>
                          <div className='mr-3 text-muted-foreground'>{index + 1}</div>
                          <div className='mr-3 text-primary'>
                            <MapPin size={18} />
                          </div>
                          <div className='flex-1'>
                            <div className='font-medium'>{checkpoint.name}</div>
                            {checkpoint.description && <div className='text-xs text-muted-foreground'>{checkpoint.description}</div>}
                            <Badge variant='outline' className={checkpoint.status === 'ACTIVE' ? 'mt-1 bg-green-50 text-green-700' : 'mt-1 bg-gray-100 text-gray-800'}>
                              {checkpoint.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='flex h-32 items-center justify-center p-4 text-muted-foreground'>
                        <div className='flex flex-col items-center gap-2'>
                          <AlertCircle className='h-5 w-5' />
                          <p>Không có trạm dừng trong tuyến này</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>
                <div className='flex flex-col items-center gap-2'>
                  <Route className='h-6 w-6' />
                  <p>Chọn một xe buýt để xem tuyến đường</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className='flex h-1/2 flex-col'>
        <div className='border-b p-4'>
          <div>
            <h3 className='font-medium'>Học sinh</h3>
            {selectedCheckpoint && (
              <p className='text-sm text-muted-foreground'>
                {students.length} học sinh tại {selectedCheckpoint.name}
              </p>
            )}
          </div>
        </div>

        {isLoadingStudents ? (
          <div className='flex h-full items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>Đang tải học sinh...</p>
            </div>
          </div>
        ) : selectedCheckpoint ? (
          students.length > 0 ? (
            <ScrollArea className='h-[calc(100%-57px)]'>
              {groupedStudents.registered.length > 0 && (
                <div className='p-2'>
                  <div className='flex items-center gap-1 px-2 py-1 text-sm font-medium text-muted-foreground'>
                    <CheckCircle2 className='h-4 w-4' />
                    <span>Học sinh đã đăng ký ({groupedStudents.registered.length})</span>
                  </div>

                  {groupedStudents.registered.map((student) => (
                    <div key={student.id} className='flex items-center rounded-md border-b p-3 transition-colors last:border-0 hover:bg-muted/50'>
                      <div className='mr-3 text-green-600'>
                        <Users size={18} />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>{student.name}</div>
                        <div className='flex items-center gap-1'>
                          <Badge variant='outline' className='bg-green-50 text-green-700'>
                            Đã đăng ký
                          </Badge>
                          {student.busId && <span className='text-xs text-muted-foreground'>{student.busName}</span>}
                        </div>
                        {student.rollNumber && <div className='mt-1 text-xs text-muted-foreground'>ID: {student.rollNumber}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {groupedStudents.waiting.length > 0 && (
                <div className='p-2'>
                  <div className='flex items-center gap-1 px-2 py-1 text-sm font-medium text-muted-foreground'>
                    <Clock className='h-4 w-4' />
                    <span>Học sinh chờ đăng ký ({groupedStudents.waiting.length})</span>
                  </div>

                  {groupedStudents.waiting.map((student) => (
                    <div key={student.id} className='flex items-center rounded-md border-b p-3 transition-colors last:border-0 hover:bg-muted/50'>
                      <div className='mr-3 text-yellow-600'>
                        <Users size={18} />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>{student.name}</div>
                        <Badge variant='outline' className='bg-yellow-50 text-yellow-700'>
                          Đang chờ
                        </Badge>
                        {student.rollNumber && <div className='mt-1 text-xs text-muted-foreground'>ID: {student.rollNumber}</div>}
                      </div>

                      {buses.length > 0 && (
                        <div className='flex gap-1'>
                          {buses.slice(0, 2).map((bus) => {
                            const isFull = (bus.registeredCount || 0) >= (bus.capacity || 30)
                            return (
                              <Button key={bus.id} size='sm' variant='outline' className='h-7 px-2' onClick={() => onRegisterStudent(student.id, bus.id)} disabled={isFull} title={isFull ? 'Xe đã đầy' : `Phân công cho ${bus.name}`}>
                                {bus.name}
                              </Button>
                            )
                          })}

                          {buses.length > 2 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size='sm' variant='outline' className='h-7 px-2'>
                                  Thêm
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Phân công học sinh cho xe buýt</DialogTitle>
                                </DialogHeader>
                                <div className='grid gap-2'>
                                  {buses.slice(2).map((bus) => {
                                    const isFull = (bus.registeredCount || 0) >= (bus.capacity || 30)
                                    return (
                                      <Button
                                        key={bus.id}
                                        variant='outline'
                                        onClick={() => {
                                          onRegisterStudent(student.id, bus.id)
                                          const dialogCloseButton = document.querySelector('[role="dialog"]')?.closest('div[data-state="open"]')?.querySelector('button[data-state="closed"]')

                                          if (dialogCloseButton) {
                                            ;(dialogCloseButton as HTMLElement).click()
                                          }
                                        }}
                                        disabled={isFull}
                                        className='justify-between'
                                      >
                                        <span>{bus.name}</span>
                                        <span className='text-xs text-muted-foreground'>
                                          {bus.registeredCount || 0}/{bus.capacity || 30}
                                        </span>
                                      </Button>
                                    )
                                  })}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>
              <div className='flex flex-col items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                <p>Không có học sinh tại trạm dừng này</p>
              </div>
            </div>
          )
        ) : (
          <div className='flex h-full items-center justify-center text-muted-foreground'>
            <div className='flex flex-col items-center gap-2'>
              <Users className='h-6 w-6' />
              <p>Chọn một trạm dừng để xem học sinh</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
