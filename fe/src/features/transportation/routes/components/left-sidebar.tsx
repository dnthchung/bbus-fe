'use client'

import { useState, useEffect } from 'react'
import type { BusStop } from '@/types/bus'
import { Search, MapPin, Users, BusIcon, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LeftSidebarProps {
  checkpoints: BusStop[]
  selectedCheckpoint: BusStop | null
  onSelectCheckpoint: (checkpoint: BusStop) => void
}

export default function LeftSidebar({ checkpoints, selectedCheckpoint, onSelectCheckpoint }: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('checkpoints')
  const [filteredCheckpoints, setFilteredCheckpoints] = useState<BusStop[]>(checkpoints)
  const [stats, setStats] = useState({
    totalCheckpoints: 0,
    activeCheckpoints: 0,
    inactiveCheckpoints: 0,
    totalStudents: 0,
  })

  // Filter checkpoints based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredCheckpoints(checkpoints.filter((checkpoint) => checkpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) || (checkpoint.description && checkpoint.description.toLowerCase().includes(searchQuery.toLowerCase()))))
    } else {
      setFilteredCheckpoints(checkpoints)
    }
  }, [searchQuery, checkpoints])

  // Calculate statistics
  useEffect(() => {
    const totalCheckpoints = checkpoints.length
    const activeCheckpoints = checkpoints.filter((cp) => cp.status === 'ACTIVE').length
    const inactiveCheckpoints = checkpoints.filter((cp) => cp.status === 'INACTIVE').length
    const totalStudents = checkpoints.reduce((sum, checkpoint) => {
      // Make sure studentCount is a number
      const count = typeof checkpoint.studentCount === 'number' ? checkpoint.studentCount : typeof checkpoint.studentCount === 'object' ? 0 : Number(checkpoint.studentCount) || 0
      return sum + count
    }, 0)

    setStats({
      totalCheckpoints,
      activeCheckpoints,
      inactiveCheckpoints,
      totalStudents,
    })
  }, [checkpoints])

  return (
    <div className='flex h-full w-72 flex-col border-r bg-background'>
      <div className='border-b p-4'>
        <h2 className='mb-2 text-xl font-semibold'>Vận Chuyển</h2>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Tìm kiếm trạm dừng...' className='pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue='checkpoints' className='flex flex-1 flex-col' value={activeTab} onValueChange={setActiveTab}>
        <div className='border-b px-2 pt-2'>
          <TabsList className='w-full'>
            <TabsTrigger value='checkpoints' className='flex-1'>
              <MapPin className='mr-2 h-4 w-4' />
              Trạm Dừng
            </TabsTrigger>
            <TabsTrigger value='stats' className='flex-1'>
              <BusIcon className='mr-2 h-4 w-4' />
              Thống Kê
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='checkpoints' className='flex-1 p-0'>
          <ScrollArea className='h-full'>
            {filteredCheckpoints.length > 0 ? (
              filteredCheckpoints.map((checkpoint) => {
                // Make sure studentCount is a number
                const studentCount = typeof checkpoint.studentCount === 'number' ? checkpoint.studentCount : typeof checkpoint.studentCount === 'object' ? 0 : Number(checkpoint.studentCount) || 0

                return (
                  <div key={checkpoint.id} className={`flex cursor-pointer items-center border-b p-3 transition-colors hover:bg-muted/50 ${selectedCheckpoint?.id === checkpoint.id ? 'bg-muted' : ''}`} onClick={() => onSelectCheckpoint(checkpoint)}>
                    <div className='mr-3 text-primary'>
                      <MapPin size={18} />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>{checkpoint.name}</div>
                      <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Users size={14} />
                        <span>{studentCount} học sinh</span>
                      </div>
                    </div>
                    {checkpoint.status === 'INACTIVE' ? (
                      <Badge variant='outline' className='ml-2 bg-gray-100 text-gray-800'>
                        Không hoạt động
                      </Badge>
                    ) : studentCount > 20 ? (
                      <Badge variant='secondary' className='ml-2'>
                        Đông học sinh
                      </Badge>
                    ) : null}
                  </div>
                )
              })
            ) : (
              <div className='flex h-32 items-center justify-center text-muted-foreground'>
                <div className='flex flex-col items-center gap-2'>
                  <AlertCircle className='h-5 w-5' />
                  <p>Không tìm thấy trạm dừng</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value='stats' className='flex-1 p-0'>
          <div className='p-4'>
            <h3 className='mb-4 text-lg font-medium'>Thống Kê Vận Chuyển</h3>

            <div className='space-y-4'>
              <div className='rounded-lg border bg-card p-4 shadow-sm'>
                <h4 className='text-sm font-medium text-muted-foreground'>Tổng Số Trạm Dừng</h4>
                <p className='mt-1 text-2xl font-bold'>{stats.totalCheckpoints}</p>
                <div className='mt-2 flex gap-2'>
                  <Badge variant='outline' className='bg-green-50 text-green-700'>
                    {stats.activeCheckpoints} Đang hoạt động
                  </Badge>
                  <Badge variant='outline' className='bg-gray-50 text-gray-700'>
                    {stats.inactiveCheckpoints} Không hoạt động
                  </Badge>
                </div>
              </div>

              <div className='rounded-lg border bg-card p-4 shadow-sm'>
                <h4 className='text-sm font-medium text-muted-foreground'>Tổng Số Học Sinh</h4>
                <p className='mt-1 text-2xl font-bold'>{stats.totalStudents}</p>
              </div>

              <Button className='w-full' variant='outline'>
                Tạo Báo Cáo
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
