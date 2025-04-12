'use client'

import { useState } from 'react'
import type { BusStop, Bus, Student } from '@/types/bus'
import { BusIcon, Users, UserPlus, MapPin, AlertCircle, CheckCircle2, Clock, Loader2, Phone, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RightPanelProps {
  buses: Bus[]
  students: Student[]
  selectedCheckpoint: BusStop | null
  selectedBus: Bus | null
  onSelectBus: (bus: Bus | null) => void
  onAutoFill: () => void
  onRegisterStudent: (studentId: string, busId: string) => void
  isLoadingBuses: boolean
  isLoadingStudents: boolean
}

export default function RightPanel({ buses, students, selectedCheckpoint, selectedBus, onSelectBus, onAutoFill, onRegisterStudent, isLoadingBuses, isLoadingStudents }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState('buses')

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

  return (
    <div className='flex h-full w-96 flex-col border-l'>
      <Tabs defaultValue='buses' className='flex h-1/2 flex-col' value={activeTab} onValueChange={setActiveTab}>
        <div className='border-b px-4 py-2'>
          <TabsList className='w-full'>
            <TabsTrigger value='buses' className='flex-1'>
              <BusIcon className='mr-2 h-4 w-4' />
              Xe buýt
            </TabsTrigger>
            <TabsTrigger value='route' className='flex-1' disabled={!selectedBus}>
              <MapPin className='mr-2 h-4 w-4' />
              Tuyến đường
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='buses' className='flex-1 overflow-hidden p-0'>
          {selectedCheckpoint ? (
            <div className='flex h-full flex-col'>
              <div className='border-b p-4'>
                <h3 className='font-medium'>Xe buýt tại {selectedCheckpoint.name}</h3>
                <p className='text-sm text-muted-foreground'>{buses.length} xe buýt đi qua trạm dừng này</p>
              </div>

              {isLoadingBuses ? (
                <div className='flex h-full items-center justify-center'>
                  <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary' />
                    <p className='text-sm text-muted-foreground'>Đang tải xe buýt...</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className='flex-1'>
                  {buses.length > 0 ? (
                    buses.map((bus) => {
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
                                title='View Details'
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
                    })
                  ) : (
                    <div className='flex h-32 items-center justify-center p-4 text-muted-foreground'>
                      <div className='flex flex-col items-center gap-2'>
                        <AlertCircle className='h-5 w-5' />
                        <p>Không có xe buýt đi qua trạm dừng này</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>
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
          {selectedBus && (
            <div className='flex h-full flex-col'>
              <div className='border-b p-4'>
                <h3 className='font-medium'>{selectedBus.name} Details</h3>
                <p className='text-sm text-muted-foreground'>{selectedBus.licensePlate}</p>
              </div>

              <ScrollArea className='flex-1 p-4'>
                <div className='space-y-4'>
                  <div>
                    <h4 className='text-sm font-medium'>Thông tin tài xế</h4>
                    <div className='mt-1 rounded-md border p-3'>
                      <div className='font-medium'>{selectedBus.driverName || 'Chưa được phân công'}</div>
                      {selectedBus.driverPhone && (
                        <div className='mt-1 flex items-center text-sm text-muted-foreground'>
                          <Phone className='mr-1 h-3 w-3' />
                          {selectedBus.driverPhone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium'>Thông tin trợ lý</h4>
                    <div className='mt-1 rounded-md border p-3'>
                      <div className='font-medium'>{selectedBus.assistantName || 'Chưa được phân công'}</div>
                      {selectedBus.assistantPhone && (
                        <div className='mt-1 flex items-center text-sm text-muted-foreground'>
                          <Phone className='mr-1 h-3 w-3' />
                          {selectedBus.assistantPhone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium'>Thông tin tuyến đường</h4>
                    <div className='mt-1 rounded-md border p-3'>
                      <div className='font-medium'>Mã tuyến: {selectedBus.routeCode || 'N/A'}</div>
                      <div className='mt-1 text-sm text-muted-foreground'>ID tuyến: {selectedBus.routeId || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium'>Sức chứa</h4>
                    <div className='mt-1 rounded-md border p-3'>
                      <div className='flex items-center justify-between'>
                        <span>Học sinh:</span>
                        <span className='font-medium'>
                          {selectedBus.registeredCount || 0}/{selectedBus.capacity || 30}
                        </span>
                      </div>
                      <div className='mt-2'>
                        <Progress value={((selectedBus.registeredCount || 0) / (selectedBus.capacity || 30)) * 100} className='h-2' />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium'>Status</h4>
                    <div className='mt-1 rounded-md border p-3'>
                      <Badge className={selectedBus.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}>{selectedBus.status || 'Unknown'}</Badge>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Separator />

      <div className='flex h-1/2 flex-col'>
        <div className='flex items-center justify-between border-b p-4'>
          <div>
            <h3 className='font-medium'>Students</h3>
            {selectedCheckpoint && (
              <p className='text-sm text-muted-foreground'>
                {students.length} học sinh tại {selectedCheckpoint.name}
              </p>
            )}
          </div>
          <Button size='sm' onClick={onAutoFill} disabled={!selectedCheckpoint || groupedStudents.waiting.length === 0 || buses.length === 0}>
            <UserPlus className='mr-1 h-4 w-4' />
            Tự động phân công
          </Button>
        </div>

        {isLoadingStudents ? (
          <div className='flex h-full items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>Đang tải học sinh...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className='flex-1'>
            {selectedCheckpoint ? (
              students.length > 0 ? (
                <>
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
                              {student.busId && <span className='text-xs text-muted-foreground'>{student.busName || `Bus ${student.busId.substring(0, 6)}`}</span>}
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
                        <span>Học sinh đang chờ ({groupedStudents.waiting.length})</span>
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
                                  <Button key={bus.id} size='sm' variant='outline' className='h-7 px-2' onClick={() => onRegisterStudent(student.id, bus.id)} disabled={isFull} title={isFull ? 'Xe buýt đã đầy' : `Phân công cho ${bus.name}`}>
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
                </>
              ) : (
                <div className='flex h-32 items-center justify-center text-muted-foreground'>
                  <div className='flex flex-col items-center gap-2'>
                    <AlertCircle className='h-5 w-5' />
                    <p>No students at this checkpoint</p>
                  </div>
                </div>
              )
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>
                <div className='flex flex-col items-center gap-2'>
                  <Users className='h-6 w-6' />
                  <p>Select a checkpoint to view students</p>
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
