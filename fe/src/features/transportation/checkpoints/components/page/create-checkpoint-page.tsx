'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X, Navigation, Search, MapPin, Plus } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { LimitedTextarea } from '@/components/mine/limited-textarea'
import { Status } from '@/components/mine/status'
import { useCheckpoints } from '@/features/transportation/checkpoints/context/checkpoints-context'

const DEFAULT_POSITION: [number, number] = [21.0285, 105.8542] // Hà Nội

// Component to update the map view remotely
const MapController = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

// Component to handle user clicks on the map
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
  // Use the context instead of local state for checkpoints
  const { checkpoints, refreshCheckpoints } = useCheckpoints()

  // Get current location and zoom to it
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
        setCheckpoint(coords)
        setMapCenter(coords)
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    )
  }

  // Search for a location using Nominatim API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`)
      setSearchResults(response.data)
      if (response.data.length > 0) {
        const coords: [number, number] = [Number.parseFloat(response.data[0].lat), Number.parseFloat(response.data[0].lon)]
        setCheckpoint(coords)
        setMapCenter(coords)
      }
    } catch (error) {
      console.error('Error searching location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Select a location from the search results
  const selectLocation = (location: any) => {
    const coords: [number, number] = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
    setCheckpoint(coords)
    setMapCenter(coords)
    setSearchResults([])
    setSearchQuery('')
  }

  // Save a new checkpoint via the API
  const saveCheckpoint = async () => {
    if (!checkpoint || !checkpointName.trim() || !description.trim()) {
      toast({
        title: 'Vui lòng nhập đầy đủ thông tin!',
        description: 'Vui lòng nhập đầy đủ thông tin để tạo điểm dừng mới.',
        variant: 'deny',
      })
      return
    }

    setIsLoading(true)
    try {
      const checkpointData = {
        checkpointName: checkpointName.trim(),
        description: description.trim(),
        latitude: checkpoint[0].toString(),
        longitude: checkpoint[1].toString(),
      }
      await API_SERVICES.checkpoints.add_one(checkpointData)
      await refreshCheckpoints()
      setCheckpointName('')
      setDescription('')
      setCheckpoint(null)
      toast({
        title: 'Đã lưu thành công!',
        description: 'Điểm dừng mới đã được lưu thành công.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Lỗi khi tạo điểm dừng!',
        description: 'Đã xảy ra lỗi khi lưu điểm dừng. Vui lòng thử lại sau.',
        variant: 'deny',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Top Section: Map and Form */}
      <div className='flex flex-col md:flex-row md:space-x-6'>
        {/* Left: Map */}
        <div className='w-full md:w-1/2'>
          <Card className='relative border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-primary' /> Bản đồ điểm dừng
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
                {/* Search Bar */}
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
                {/* Current Location Button */}
                <Button variant='secondary' onClick={getCurrentLocation} title='Sử dụng vị trí hiện tại' className='absolute bottom-4 left-4 z-[10] h-9 px-3 shadow-lg'>
                  <Navigation className='mr-2 h-4 w-4' /> Vị trí hiện tại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Checkpoint Form */}
        <div className='w-full md:w-1/2'>
          <Card className='border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2'>
                <Plus className='h-5 w-5 text-primary' /> Thông tin điểm dừng
              </CardTitle>
              <CardDescription>Nhập thông tin chi tiết cho điểm dừng mới</CardDescription>
            </CardHeader>
            <div className='px-6 py-2'>
              <Separator className='bg-muted-foreground/10' />
            </div>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                {/* Checkpoint Name */}
                <div className='space-y-2'>
                  <Label htmlFor='checkpoint-name'>Tên điểm dừng</Label>
                  {/* <Input id='checkpoint-name' value={checkpointName} onChange={(e) => setCheckpointName(e.target.value)} placeholder='Nhập tên điểm dừng' /> */}
                  <Input
                    id='checkpoint-name'
                    value={checkpointName}
                    onChange={(e) => {
                      const val = e.target.value.trimStart() // giữ khoảng trắng đầu cho smooth typing
                      if (val.length <= 128) {
                        setCheckpointName(val)
                      }
                    }}
                    placeholder='Nhập tên điểm dừng (tối đa 128 ký tự)'
                  />
                </div>
                {/* Description */}
                <div className='space-y-2'>
                  <Label htmlFor='checkpoint-description'>Mô tả</Label>
                  {/* <Textarea id='checkpoint-description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Nhập mô tả ngắn gọn' rows={3} /> */}

                  <LimitedTextarea
                    value={description}
                    onChange={(val) => setDescription(val)}
                    placeholder='Nhập mô tả ngắn gọn'
                    maxLength={3000} // bạn có thể tùy chỉnh nếu cần
                    disabled={isLoading}
                  />
                </div>
                {/* Coordinates */}
                <div className='space-y-2'>
                  <Label>Vị trí</Label>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <Label htmlFor='latitude' className='text-xs text-muted-foreground'>
                        Vĩ độ
                      </Label>
                      <Input id='latitude' value={checkpoint ? checkpoint[0].toFixed(6) : ''} readOnly placeholder='Chọn điểm trên bản đồ' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='longitude' className='text-xs text-muted-foreground'>
                        Kinh độ
                      </Label>
                      <Input id='longitude' value={checkpoint ? checkpoint[1].toFixed(6) : ''} readOnly placeholder='Chọn điểm trên bản đồ' />
                    </div>
                  </div>
                  {checkpoint && (
                    <div className='flex justify-end'>
                      <Button variant='ghost' size='sm' className='h-8 text-destructive' onClick={() => setCheckpoint(null)}>
                        <X className='mr-1 h-4 w-4' /> Xóa vị trí
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
              <Button onClick={saveCheckpoint} className='w-full' disabled={!checkpoint || !checkpointName.trim() || !description.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div> Đang lưu...
                  </>
                ) : (
                  'Lưu điểm dừng'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Checkpoint List */}
      <div className='rounded-lg border'>
        <div className='border-b p-4'>
          <h3 className='flex items-center gap-2 text-lg font-semibold'>
            <MapPin className='h-5 w-5 text-primary' /> Danh sách điểm dừng
          </h3>
          <p className='text-sm text-muted-foreground'>Các điểm dừng hiện có trong hệ thống</p>
        </div>
        <ScrollArea className='h-[850px]'>
          <table className='w-full'>
            <thead className='sticky top-0 bg-muted text-left'>
              <tr>
                <th className='w-[40%] p-3 text-sm font-medium'>Tên điểm dừng</th>
                <th className='w-[20%] p-3 text-sm font-medium'>Trạng thái</th>
                <th className='w-[40%] p-3 text-sm font-medium'>Vị trí</th>
              </tr>
            </thead>

            <tbody>
              {checkpoints.length === 0 ? (
                <tr>
                  <td colSpan={3} className='p-4 text-center text-muted-foreground'>
                    Chưa có điểm dừng nào
                  </td>
                </tr>
              ) : (
                checkpoints.map((cp) => (
                  <tr key={cp.id} className='border-b hover:bg-muted/50'>
                    <td className='w-[20%] p-3'>
                      <div>
                        <p className='font-medium'>{cp.name}</p>
                        <p className='text-xs text-muted-foreground'>{cp.description}</p>
                      </div>
                    </td>
                    <td className='w-[20%] p-3'>
                      <Status color={cp.status === 'ACTIVE' ? 'green' : 'gray'} showDot={true}>
                        {cp.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </Status>
                    </td>
                    <td className='p-3'>
                      <div className='text-xs'>
                        <p>
                          <span className='font-medium'>Lat:</span> {cp.latitude}
                        </p>
                        <p>
                          <span className='font-medium'>Long:</span> {cp.longitude}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  )
}
