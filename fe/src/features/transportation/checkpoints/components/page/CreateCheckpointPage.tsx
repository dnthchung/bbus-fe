'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X, Navigation, Search, MapPin, Plus } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const DEFAULT_POSITION: [number, number] = [21.0285, 105.8542] // Hà Nội
const existingCheckpoints = [
  {
    id: '346b48c3-912f-456f-b2e2-4469260962e6',
    name: 'Cầu Chương Dương',
    description: 'Trạm xe buýt ở đầu cầu Chương Dương',
    latitude: '21.033028',
    longitude: '105.863672',
    status: 'INACTIVE',
  },
  {
    id: '40c64531-8e7a-4294-9e48-e41f02f57e3b',
    name: 'Công viên Thống Nhất',
    description: 'Điểm dừng xe gần Công viên Thống Nhất',
    latitude: '21.017111',
    longitude: '105.847450',
    status: 'INACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    status: 'ACTIVE',
  },
]

// Component để cập nhật vị trí và zoom của bản đồ từ xa
const MapController = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

// Component xử lý khi người dùng click trên bản đồ
const MapClickHandler = ({ setCheckpoint }: { setCheckpoint: (coords: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => {
      setCheckpoint([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export default function CreateCheckpointPage() {
  const [checkpoint, setCheckpoint] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [checkpointName, setCheckpointName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef(null)
  const [checkpoints, setCheckpoints] = useState(existingCheckpoints)

  // Lấy vị trí hiện tại và zoom đến vị trí đó
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
        setCheckpoint(coords)
        setMapCenter(coords) // Cập nhật trung tâm bản đồ để zoom vào điểm
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    )
  }

  // Tìm kiếm địa điểm
  const searchLocation = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`)
      setSearchResults(response.data)
      if (response.data.length > 0) {
        const coords: [number, number] = [Number.parseFloat(response.data[0].lat), Number.parseFloat(response.data[0].lon)]
        setCheckpoint(coords)
        setMapCenter(coords) // Cập nhật vị trí trung tâm bản đồ
      }
    } catch (error) {
      console.error('Error searching location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Chọn địa điểm từ kết quả tìm kiếm
  const selectLocation = (location: any) => {
    const coords: [number, number] = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
    setCheckpoint(coords)
    setMapCenter(coords) // Zoom tới vị trí
    setSearchResults([])
    setSearchQuery('')
  }

  // Lưu điểm dừng mới vào hệ thống
  const saveCheckpoint = async () => {
    if (!checkpoint || !checkpointName.trim() || !description.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin điểm dừng.')
      return
    }

    const newCheckpoint = {
      id: crypto.randomUUID(),
      name: checkpointName,
      description,
      latitude: checkpoint[0].toString(),
      longitude: checkpoint[1].toString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Đã lưu điểm dừng:', newCheckpoint)
    // Add to local state for demo purposes
    setCheckpoints([...checkpoints, newCheckpoint])
    // Reset form
    setCheckpointName('')
    setDescription('')
    setCheckpoint(null)
    alert('Điểm dừng đã được tạo thành công!')
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row'>
        {/* Map and Form Section */}
        <div className='w-full space-y-4 md:w-3/5'>
          <Card className='relative border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-primary' />
                Bản đồ điểm dừng
              </CardTitle>
              <CardDescription>Chọn vị trí trên bản đồ hoặc tìm kiếm địa điểm</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='relative z-[1] h-[400px] overflow-hidden rounded-b-lg'>
                <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-full w-full' scrollWheelZoom={true} ref={mapRef}>
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <MapController center={mapCenter} zoom={15} />
                  <MapClickHandler setCheckpoint={setCheckpoint} />
                  {checkpoint && (
                    <Marker
                      position={checkpoint}
                      icon={L.divIcon({
                        html: `<div class="bg-primary p-1 rounded-full border-2 border-background shadow-lg w-4 h-4"></div>`,
                        className: 'custom-div-icon',
                      })}
                    />
                  )}
                  {/* Existing checkpoints */}
                  {checkpoints.map((cp) => (
                    <Marker
                      key={cp.id}
                      position={[Number.parseFloat(cp.latitude), Number.parseFloat(cp.longitude)]}
                      icon={L.divIcon({
                        html: `<div class="${cp.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'} p-1 rounded-full border-2 border-background shadow-lg w-3 h-3"></div>`,
                        className: 'custom-div-icon',
                      })}
                    />
                  ))}
                </MapContainer>
                {/* Search bar */}
                <div className='absolute right-4 top-4 z-[10] w-64 space-y-2 rounded-md border border-border bg-card p-3 shadow-lg'>
                  <div className='flex gap-2'>
                    <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Tìm kiếm địa điểm...' className='h-9 flex-1' onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
                    <Button onClick={searchLocation} disabled={isLoading} size='icon' variant='secondary' className='h-9 w-9'>
                      {isLoading ? <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' /> : <Search className='h-4 w-4' />}
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <ScrollArea className='mt-2 max-h-40 rounded-md border bg-card'>
                      {searchResults.map((result, index) => (
                        <div key={index} className='cursor-pointer border-b p-2 last:border-b-0 hover:bg-accent' onClick={() => selectLocation(result)}>
                          <p className='text-sm'>{result.display_name}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </div>
                {/* Current location button */}
                <Button variant='secondary' onClick={getCurrentLocation} title='Sử dụng vị trí hiện tại' className='absolute bottom-4 left-4 z-[10] h-9 px-3 shadow-lg'>
                  <Navigation className='mr-2 h-4 w-4' />
                  Vị trí hiện tại
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Checkpoint Form */}
          <Card className='border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                <Plus className='h-5 w-5 text-primary' />
                Thông tin điểm dừng
              </CardTitle>
              <CardDescription>Nhập thông tin chi tiết cho điểm dừng mới</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                {/* Tên điểm dừng */}
                <div className='space-y-2'>
                  <Label htmlFor='checkpoint-name'>Tên điểm dừng</Label>
                  <Input id='checkpoint-name' value={checkpointName} onChange={(e) => setCheckpointName(e.target.value)} placeholder='Nhập tên điểm dừng' />
                </div>
                {/* Mô tả điểm dừng */}
                <div className='space-y-2'>
                  <Label htmlFor='checkpoint-description'>Mô tả</Label>
                  <Textarea id='checkpoint-description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Nhập mô tả ngắn gọn' rows={3} />
                </div>
                {/* Tọa độ điểm dừng - Separated as requested */}
                <div className='space-y-2'>
                  <Label>Vị trí</Label>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <Label htmlFor='latitude' className='text-xs text-muted-foreground'>
                        Latitude
                      </Label>
                      <Input id='latitude' value={checkpoint ? checkpoint[0].toFixed(6) : ''} readOnly placeholder='Chọn điểm trên bản đồ' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='longitude' className='text-xs text-muted-foreground'>
                        Longitude
                      </Label>
                      <Input id='longitude' value={checkpoint ? checkpoint[1].toFixed(6) : ''} readOnly placeholder='Chọn điểm trên bản đồ' />
                    </div>
                  </div>
                  {checkpoint && (
                    <div className='flex justify-end'>
                      <Button variant='ghost' size='sm' className='h-8 text-destructive' onClick={() => setCheckpoint(null)}>
                        <X className='mr-1 h-4 w-4' />
                        Xóa vị trí
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
              {/* Nút lưu điểm dừng */}
              <Button onClick={saveCheckpoint} className='w-full' disabled={!checkpoint || !checkpointName.trim() || !description.trim()}>
                Lưu điểm dừng
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Checkpoint List */}
        <div className='w-full md:w-2/5'>
          <Card className='h-full border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-primary' />
                Danh sách điểm dừng
              </CardTitle>
              <CardDescription>Các điểm dừng hiện có trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[850px] pr-4'>
                <div className='space-y-3'>
                  {checkpoints.map((cp, index) => (
                    <Card key={cp.id} className={cn('overflow-hidden transition-all hover:shadow-md', cp.status === 'ACTIVE' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-400')}>
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between'>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-medium'>{cp.name}</h3>
                              <Badge variant={cp.status === 'ACTIVE' ? 'default' : 'secondary'} className='text-xs'>
                                {cp.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                              </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground'>{cp.description}</p>
                          </div>
                        </div>
                        <div className='mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground'>
                          <div>
                            <span className='font-medium'>Latitude:</span> {cp.latitude}
                          </div>
                          <div>
                            <span className='font-medium'>Longitude:</span> {cp.longitude}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
