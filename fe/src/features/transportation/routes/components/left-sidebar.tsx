'use client'

//path : fe/src/features/transportation/routes/components/left-sidebar.tsx
import { useState } from 'react'
import type { BusStop } from '@/types/bus'
import { Search, MapPin, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LeftSidebarProps {
  busStops: BusStop[]
  selectedStop: BusStop | null
  onSelectStop: (stop: BusStop) => void
}

export default function LeftSidebar({ busStops, selectedStop, onSelectStop }: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter stops based on search query
  const filteredStops = searchQuery ? busStops.filter((stop) => stop.name.toLowerCase().includes(searchQuery.toLowerCase())) : busStops

  return (
    <div className='flex h-full w-64 flex-col border-r bg-background'>
      <div className='border-b p-4'>
        <h2 className='mb-2 text-lg font-semibold'>Bus Stops</h2>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input placeholder='Search stops...' className='pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className='flex-1 overflow-auto'>
        {filteredStops.map((stop) => (
          <div key={stop.id} className={`flex cursor-pointer items-center border-b p-3 transition-colors hover:bg-muted ${selectedStop?.id === stop.id ? 'bg-muted' : ''}`} onClick={() => onSelectStop(stop)}>
            <div className='mr-3 text-primary'>
              <MapPin size={18} />
            </div>
            <div className='flex-1'>
              <div className='font-medium'>{stop.name}</div>
              <div className='flex items-center text-sm text-muted-foreground'>
                <Users size={14} className='mr-1' />
                <span>{stop.studentCount} students</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
