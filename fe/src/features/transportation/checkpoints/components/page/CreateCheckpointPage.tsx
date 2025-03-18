'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X, Navigation, Search } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEFAULT_POSITION: [number, number] = [21.0285, 105.8542] // Hà Nội

const existingCheckpoints = [
  { id: 1, name: 'Trường Tiểu Học A', latitude: '21.0285', longitude: '105.8542' },
  { id: 2, name: 'Trường THPT B', latitude: '21.0352', longitude: '105.8451' },
  { id: 3, name: 'Khu Dân Cư C', latitude: '21.0423', longitude: '105.8320' },
  { id: 3, name: 'Khu Dân Cư C', latitude: '21.0423', longitude: '105.8320' },
  { id: 3, name: 'Khu Dân Cư C', latitude: '21.0423', longitude: '105.8320' },
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
        const coords: [number, number] = [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]
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
    const coords: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)]
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
    alert('Điểm dừng đã được tạo thành công!')
  }

  return (
    <div className=''>
      {/* Bản đồ */}
      <div className='relative mb-6 overflow-hidden rounded-lg border'>
        <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-96 w-full' scrollWheelZoom={true} ref={mapRef}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <MapController center={mapCenter} zoom={15} />
          <MapClickHandler setCheckpoint={setCheckpoint} />
          {checkpoint && (
            <Marker
              position={checkpoint}
              icon={L.divIcon({
                html: `<div class="bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg"></div>`,
                className: 'custom-div-icon',
              })}
            />
          )}
        </MapContainer>

        {/* Thanh tìm kiếm - Đặt ở góc dưới bên trái của bản đồ */}
        <div className='absolute bottom-4 left-4 z-[1000] w-64 space-y-2 rounded-md bg-white p-2 shadow-lg'>
          <Label htmlFor='location-search' className='block text-sm'>
            Tìm kiếm địa điểm
          </Label>
          <div className='flex gap-2'>
            <Input id='location-search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Nhập địa chỉ hoặc địa điểm' className='h-8 flex-1' onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
            <Button onClick={searchLocation} disabled={isLoading} className='h-8 px-3'>
              {isLoading ? 'Đang tìm...' : <Search className='h-4 w-4' />}
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className='mt-2 max-h-40 overflow-y-auto rounded-md border bg-white'>
              {searchResults.map((result, index) => (
                <div key={index} className='cursor-pointer border-b p-1 last:border-b-0 hover:bg-slate-100' onClick={() => selectLocation(result)}>
                  <p className='text-sm'>{result.display_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4 border-t pt-4 text-sm text-gray-500'>
        {/* left */}
        <div className='col-span-1'>
          {/* Nội dung cột trái */}
          {/* Thông tin điểm dừng */}
          <div className='space-y-4'>
            {/* Tên điểm dừng */}
            <div>
              <Label htmlFor='checkpoint-name' className='block text-sm'>
                Tên điểm dừng
              </Label>
              <Input id='checkpoint-name' value={checkpointName} onChange={(e) => setCheckpointName(e.target.value)} placeholder='Nhập tên điểm dừng' className='mt-1 h-8' />
            </div>

            {/* Mô tả điểm dừng */}
            <div>
              <Label htmlFor='checkpoint-description' className='block text-sm'>
                Mô tả
              </Label>
              <Input id='checkpoint-description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Nhập mô tả ngắn gọn' className='mt-1 h-8' />
            </div>

            {/* Tọa độ điểm dừng */}
            <div>
              <Label className='block text-sm'>Vị trí</Label>
              <div className='flex items-center gap-2'>
                <Input value={checkpoint ? `${checkpoint[0].toFixed(5)}, ${checkpoint[1].toFixed(5)}` : ''} readOnly placeholder='Chọn điểm trên bản đồ hoặc tìm kiếm' className='mt-1 h-8 flex-1' />
                <Button variant='outline' onClick={getCurrentLocation} title='Sử dụng vị trí hiện tại' className='h-8 px-3'>
                  <Navigation className='h-4 w-4' />
                </Button>
                {checkpoint && (
                  <Button variant='ghost' className='h-8 w-8 p-0 text-red-500' onClick={() => setCheckpoint(null)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            {/* Nút lưu điểm dừng */}
            <Button onClick={saveCheckpoint} className='h-8 w-full' disabled={!checkpoint}>
              Lưu điểm dừng
            </Button>
          </div>
        </div>

        {/* right */}
        <div className='col-span-1'>
          {/* Nội dung cột phải */}
          <p>Nội dung cột phải</p>
          {/*
            Đây sẽ là 1 table hoặc 1 list hiển thị danh sách các tên điẻm dường có sẵn trong hệ thống (mục đích đe ẻkhi tạo mới có thể xem là có những điểm nào rồi, trnahs tạo trùng)
          */}
          <div className='col-span-1 rounded-lg border p-4 shadow-md'>
            <h3 className='mb-2 text-lg font-bold'>📌 Danh sách điểm dừng</h3>
            <table className='w-full border-collapse border border-gray-300 text-sm'>
              <thead>
                <tr className=''>
                  <th className='border p-2'>#</th>
                  <th className='border p-2'>Tên điểm dừng</th>
                  <th className='border p-2'>Toạ độ</th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp, index) => (
                  <tr key={cp.id} className='text-center'>
                    <td className='border p-2'>{index + 1}</td>
                    <td className='border p-2'>{cp.name}</td>
                    <td className='border p-2'>
                      {cp.latitude}, {cp.longitude}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
