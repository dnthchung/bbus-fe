'use client'

//path : fe/src/features/transportation/routes/components/right-panel.tsx
import { useState } from 'react'
import { busStops } from '@/data/sample-data'
import type { BusStop, Bus, Student } from '@/types/bus'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BusIcon, Users, Plus, ArrowUpDown, UserPlus, MapPin, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sortable stop item component
function SortableStopItem({ stop, index }: { stop: BusStop; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stop.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className='flex items-center border-b p-3'>
      <div className='mr-3 text-muted-foreground'>{index + 1}</div>
      <div className='mr-3 text-primary'>
        <MapPin size={18} />
      </div>
      <div className='flex-1'>
        <div className='font-medium'>{stop.name}</div>
        <div className='text-sm text-muted-foreground'>{stop.studentCount} students</div>
      </div>
      <div className='cursor-grab text-muted-foreground' {...listeners}>
        <GripVertical size={18} />
      </div>
    </div>
  )
}

interface RightPanelProps {
  buses: Bus[]
  students: Student[]
  selectedStop: BusStop | null
  selectedBus: Bus | null
  onSelectBus: (bus: Bus | null) => void
  onAutoFill: () => void
  onAddStop: (busId: number, stopId: number) => void
  onReorderStops: (busId: number, stopIds: number[]) => void
  onRegisterStudent: (studentId: number, busId: number) => void
}

export default function RightPanel({ buses, students, selectedStop, selectedBus, onSelectBus, onAutoFill, onAddStop, onReorderStops, onRegisterStudent }: RightPanelProps) {
  const [isAddStopDialogOpen, setIsAddStopDialogOpen] = useState(false)

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end for reordering stops
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !selectedBus) return

    if (active.id !== over.id) {
      const oldIndex = selectedBus.route.findIndex((stop) => stop.id.toString() === active.id)
      const newIndex = selectedBus.route.findIndex((stop) => stop.id.toString() === over.id)

      const newRoute = arrayMove(selectedBus.route, oldIndex, newIndex)
      onReorderStops(
        selectedBus.id,
        newRoute.map((stop) => stop.id)
      )
    }
  }

  return (
    <div className='flex h-full w-96 flex-col border-l'>
      <Tabs defaultValue='buses' className='flex h-1/2 flex-col'>
        <div className='border-b px-4 py-2'>
          <TabsList className='w-full'>
            <TabsTrigger value='buses' className='flex-1'>
              <BusIcon className='mr-2 h-4 w-4' />
              Xe buýt
            </TabsTrigger>
            <TabsTrigger value='route' className='flex-1' disabled={!selectedBus}>
              <ArrowUpDown className='mr-2 h-4 w-4' />
              Tuyến đường
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='buses' className='flex-1 overflow-auto p-0'>
          {selectedStop ? (
            <div className='flex h-full flex-col'>
              <div className='border-b p-4'>
                <h3 className='font-medium'>Xe buýt tại {selectedStop.name}</h3>
                <p className='text-sm text-muted-foreground'>{buses.length} xe buýt đi qua điểm dừng này</p>
              </div>
              <div className='flex-1 overflow-auto'>
                {buses.length > 0 ? (
                  buses.map((bus) => (
                    <div key={bus.id} className={`flex cursor-pointer items-center border-b p-3 transition-colors hover:bg-muted ${selectedBus?.id === bus.id ? 'bg-muted' : ''}`} onClick={() => onSelectBus(bus)}>
                      <div className='mr-3 text-primary'>
                        <BusIcon size={18} />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>Bus {bus.id}</div>
                        <div className='text-sm text-muted-foreground'>
                          {bus.registeredCount}/{bus.capacity} students
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex h-full items-center justify-center p-4 text-muted-foreground'>Không có xe bus nào đi qua trạm dừng này</div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>Danh sách xe bus tại điểm dừng.</div>
          )}
        </TabsContent>

        <TabsContent value='route' className='flex-1 overflow-auto p-0'>
          {selectedBus && (
            <div className='flex h-full flex-col'>
              <div className='flex items-center justify-between border-b p-4'>
                <div>
                  <h3 className='font-medium'>Tuyến đường xe buýt {selectedBus.id}</h3>
                  <p className='text-sm text-muted-foreground'>{selectedBus.route.length} điểm dừng</p>
                </div>
                <Dialog open={isAddStopDialogOpen} onOpenChange={setIsAddStopDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size='sm' variant='outline'>
                      <Plus className='mr-1 h-4 w-4' />
                      Thêm điểm dừng
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm điểm dừng vào tuyến đường</DialogTitle>
                    </DialogHeader>
                    <div className='max-h-[300px] overflow-auto'>
                      {busStops
                        .filter((stop) => !selectedBus.route.some((s) => s.id === stop.id))
                        .map((stop) => (
                          <div
                            key={stop.id}
                            className='flex cursor-pointer items-center border-b p-3 transition-colors hover:bg-muted'
                            onClick={() => {
                              onAddStop(selectedBus.id, stop.id)
                              setIsAddStopDialogOpen(false)
                            }}
                          >
                            <div className='mr-3 text-primary'>
                              <MapPin size={18} />
                            </div>
                            <div className='flex-1'>
                              <div className='font-medium'>{stop.name}</div>
                              <div className='text-sm text-muted-foreground'>{stop.studentCount} students</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedBus.route.map((stop) => stop.id.toString())} strategy={verticalListSortingStrategy}>
                  <div className='flex-1 overflow-auto'>{selectedBus.route.length > 0 ? selectedBus.route.map((stop, index) => <SortableStopItem key={stop.id} stop={stop} index={index} />) : <div className='flex h-full items-center justify-center p-4 text-muted-foreground'>No stops in this route. Add stops to create a route.</div>}</div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className='flex h-1/2 flex-col border-t'>
        <div className='flex items-center justify-between border-b p-4'>
          <div>
            <h3 className='font-medium'>Học sinh</h3>
            {selectedStop && (
              <p className='text-sm text-muted-foreground'>
                {students.length} học sinh tại {selectedStop.name}
              </p>
            )}
          </div>
          <Button size='sm' onClick={onAutoFill} disabled={!selectedStop || students.filter((s) => s.status === 'waiting').length === 0}>
            <UserPlus className='mr-1 h-4 w-4' />
            Tự động điền
          </Button>
        </div>

        <div className='flex-1 overflow-auto'>
          {selectedStop ? (
            students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className='flex items-center border-b p-3'>
                  <div className='mr-3 text-primary'>
                    <Users size={18} />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{student.name}</div>
                    <div className='flex items-center'>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${student.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.status === 'registered' ? 'Đã đăng ký' : 'Đang chờ'}</span>
                      {student.busId && <span className='ml-2 text-xs text-muted-foreground'>Bus {student.busId}</span>}
                    </div>
                  </div>
                  {student.status === 'waiting' && buses.length > 0 && (
                    <div className='flex gap-1'>
                      {buses.slice(0, 3).map((bus) => (
                        <Button key={bus.id} size='sm' variant='outline' className='h-7 px-2' onClick={() => onRegisterStudent(student.id, bus.id)} disabled={bus.registeredCount >= bus.capacity}>
                          Bus {bus.id}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>No students at this stop</div>
            )
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>Danh sách học sinh tại điểm dừng.</div>
          )}
        </div>
      </div>
    </div>
  )
}
