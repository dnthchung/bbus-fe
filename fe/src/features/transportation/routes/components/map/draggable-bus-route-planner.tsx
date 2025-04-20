'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import type { Bus, BusStop } from '@/types/bus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, Plus, MapPin, Loader2, X, Check } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, useMap, Popup, Tooltip } from 'react-leaflet'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Add custom CSS to hide attribution
const customMapStyles = `
.leaflet-control-attribution {
  display: none !important;
}
.leaflet-container {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 0 !important;
}
`

const DEFAULT_POSITION: [number, number] = [21.0285, 105.8542] // Default to Hanoi coordinates

// Map controller component to control the map from outside
const MapController = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

// Create draggable marker component
const DraggableMarker = ({ position, onDragEnd, icon, tooltip, popupContent }: { position: [number, number]; onDragEnd: (pos: [number, number]) => void; icon: L.DivIcon; tooltip?: string; popupContent?: React.ReactNode }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position)
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    setMarkerPosition(position)
  }, [position])

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker) {
        const newPos = marker.getLatLng()
        const newPosition: [number, number] = [newPos.lat, newPos.lng]
        setMarkerPosition(newPosition)
        onDragEnd(newPosition)
      }
    },
  }

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={markerPosition} ref={markerRef} icon={icon}>
      {tooltip && (
        <Tooltip direction='top' offset={[0, -20]} opacity={0.9} permanent>
          {tooltip}
        </Tooltip>
      )}
      {popupContent && <Popup>{popupContent}</Popup>}
    </Marker>
  )
}

interface BusRoutePlannerProps {
  checkpoints: BusStop[]
  onUpdateCheckpoint: (checkpointId: string, newPosition: [number, number]) => void
  onAddCheckpoint: (position: [number, number], name: string) => void
  selectedBusId?: string
  selectedBus?: Bus | null
  routeGeometry?: [number, number][]
}

export default function DraggableBusRoutePlanner({ checkpoints, onUpdateCheckpoint, onAddCheckpoint, selectedBusId, selectedBus, routeGeometry }: BusRoutePlannerProps) {
  const { toast } = useToast()
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newCheckpointName, setNewCheckpointName] = useState('')
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null)
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [isAddingCheckpoint, setIsAddingCheckpoint] = useState(false)
  const mapRef = useRef(null)

  // Create custom icons
  const checkpointIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#e11d48" stroke="#9f1239" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })

  const selectedCheckpointIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#0284c7" stroke="#0c4a6e" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  })

  const tempMarkerIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#10b981" stroke="#047857" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })

  // Add custom CSS to hide attribution
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style')
    styleElement.textContent = customMapStyles
    document.head.appendChild(styleElement)

    // Cleanup function
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Search location from OpenStreetMap
  // Cập nhật các thông báo toast
  const searchLocation = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()
      setSearchResults(data)

      if (data.length > 0) {
        const coords: [number, number] = [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
        setMapCenter(coords)
      }
    } catch (error) {
      console.error('Error searching location:', error)
      toast({
        title: 'Tìm Kiếm Thất Bại',
        description: 'Không thể tìm kiếm địa điểm. Vui lòng thử lại.',
        variant: 'deny',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Select location from search results
  const selectLocation = (location: any) => {
    const coords: [number, number] = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
    setTempMarker(coords)
    setNewCheckpointName(location.display_name.split(',')[0])
    setMapCenter(coords)
    setSearchResults([])
    setSearchQuery('')
    setIsAddingCheckpoint(true)
  }

  // Handle marker drag end
  const handleMarkerDragEnd = (checkpointId: string, newPosition: [number, number]) => {
    onUpdateCheckpoint(checkpointId, newPosition)
  }

  // Handle map click to add temporary marker
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isAddingCheckpoint) {
          const { lat, lng } = e.latlng
          const coords: [number, number] = [lat, lng]
          setTempMarker(coords)
        }
      },
    })
    return null
  }

  // Add new checkpoint
  const addNewCheckpoint = () => {
    if (tempMarker && newCheckpointName) {
      onAddCheckpoint(tempMarker, newCheckpointName)
      setTempMarker(null)
      setNewCheckpointName('')
      setIsAddingCheckpoint(false)

      toast({
        title: 'Đã Thêm Trạm Dừng',
        description: `Trạm dừng mới "${newCheckpointName}" đã được tạo`,
        variant: 'success',
      })
    } else {
      toast({
        title: 'Thiếu Thông Tin',
        description: 'Vui lòng nhập tên cho trạm dừng mới',
        variant: 'deny',
      })
    }
  }

  // Cancel adding new checkpoint
  const cancelAddCheckpoint = () => {
    setTempMarker(null)
    setNewCheckpointName('')
    setIsAddingCheckpoint(false)
  }

  // Set route loading state when selectedBus changes
  useEffect(() => {
    if (selectedBus) {
      setIsRouteLoading(true)
    }
  }, [selectedBus])

  // Reset route loading when routeGeometry changes
  useEffect(() => {
    if (routeGeometry) {
      setIsRouteLoading(false)
    }
  }, [routeGeometry])

  return (
    <div className='flex h-full flex-col'>
      {/* Search Bar */}
      <div className='mb-2 flex justify-between gap-2'>
        <div className='flex flex-1 gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Tìm kiếm địa điểm...' className='pl-8' onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
          </div>
          <Button onClick={searchLocation} disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Tìm Kiếm'}
          </Button>
        </div>

        <Button variant={isAddingCheckpoint ? 'destructive' : 'outline'} onClick={isAddingCheckpoint ? cancelAddCheckpoint : () => setIsAddingCheckpoint(true)} className='gap-1'>
          {isAddingCheckpoint ? (
            <>
              <X className='h-4 w-4' />
              Hủy
            </>
          ) : (
            <>
              <Plus className='h-4 w-4' />
              Thêm Trạm Dừng
            </>
          )}
        </Button>
      </div>

      {/* Add Checkpoint Instructions */}
      {isAddingCheckpoint && (
        <Card className='mb-2 p-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-sm font-medium'>Đang Thêm Trạm Dừng Mới</h4>
              <p className='text-xs text-muted-foreground'>Nhấp vào bản đồ để đặt trạm dừng hoặc tìm kiếm một địa điểm</p>
            </div>
            {tempMarker && (
              <div className='flex items-center gap-2'>
                <Input placeholder='Tên trạm dừng' value={newCheckpointName} onChange={(e) => setNewCheckpointName(e.target.value)} className='h-8 w-40' />
                <Button size='sm' onClick={addNewCheckpoint} disabled={!newCheckpointName.trim()} className='h-8 gap-1'>
                  <Check className='h-3 w-3' />
                  Thêm
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className='mb-2 max-h-48 overflow-y-auto'>
          <div className='p-2 text-sm font-medium'>Kết Quả Tìm Kiếm ({searchResults.length})</div>
          {searchResults.map((result, index) => (
            <div key={index} className='cursor-pointer border-t p-2 transition-colors hover:bg-muted/50'>
              <p className='text-sm font-medium'>{result.display_name.split(',')[0]}</p>
              <p className='truncate text-xs text-muted-foreground'>{result.display_name}</p>
              <div className='mt-1 flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='h-7 text-xs'
                  onClick={() => {
                    const coords: [number, number] = [Number.parseFloat(result.lat), Number.parseFloat(result.lon)]
                    setMapCenter(coords)
                  }}
                >
                  Xem Trên Bản Đồ
                </Button>
                <Button size='sm' className='h-7 text-xs' onClick={() => selectLocation(result)}>
                  <MapPin className='mr-1 h-3 w-3' />
                  Đặt Làm Trạm Dừng
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Map */}
      <div className='relative flex-1 overflow-hidden rounded-lg border'>
        <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-full w-full' scrollWheelZoom={true} ref={mapRef} attributionControl={false} zoomControl={true}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='' />
          <MapController center={mapCenter} zoom={14} />
          <MapClickHandler />

          {/* Existing checkpoints */}
          {checkpoints.map((checkpoint) => {
            const isInSelectedBusRoute = selectedBus && selectedBus.route ? selectedBus.route.includes(checkpoint.id) : false
            const isActive = checkpoint.status === 'ACTIVE'

            return (
              <DraggableMarker
                key={checkpoint.id}
                position={[checkpoint.lat, checkpoint.lng]}
                onDragEnd={(pos) => handleMarkerDragEnd(checkpoint.id, pos)}
                icon={isInSelectedBusRoute ? selectedCheckpointIcon : checkpointIcon}
                popupContent={
                  <div className='text-center'>
                    <h3 className='font-medium'>{checkpoint.name}</h3>
                    {checkpoint.description && <p className='text-xs text-muted-foreground'>{checkpoint.description}</p>}
                    <p className='text-sm text-muted-foreground'>Students: {checkpoint.studentCount || 0}</p>
                    {!isActive && <Badge className='mt-1 bg-gray-100 text-gray-800'>Inactive</Badge>}
                    {isInSelectedBusRoute && selectedBus && <Badge className='mt-1 bg-blue-100 text-blue-800'>On {selectedBus.name || `Bus ${selectedBus.id.substring(0, 6)}`} Route</Badge>}
                    <p className='mt-1 text-xs'>Drag to change position</p>
                  </div>
                }
              />
            )
          })}

          {/* Temporary marker for new checkpoint */}
          {tempMarker && (
            <Marker
              position={tempMarker}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target
                  const position = marker.getLatLng()
                  setTempMarker([position.lat, position.lng])
                },
              }}
              icon={tempMarkerIcon}
            >
              <Popup>
                <div className='flex flex-col gap-2 p-1'>
                  <Input placeholder='Checkpoint name' value={newCheckpointName} onChange={(e) => setNewCheckpointName(e.target.value)} className='min-w-[200px]' />
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline' onClick={cancelAddCheckpoint} className='flex-1'>
                      Cancel
                    </Button>
                    <Button size='sm' onClick={addNewCheckpoint} disabled={!newCheckpointName.trim()} className='flex-1'>
                      Add Checkpoint
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* OSRM route with loading state */}
          {isRouteLoading && selectedBus && !routeGeometry && (
            <div className='absolute right-2 top-2 z-[1000] rounded-md bg-white p-2 shadow-md'>
              <div className='flex items-center space-x-2'>
                <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
                <span className='text-sm'>Loading route...</span>
              </div>
            </div>
          )}

          {/* OSRM Route Polyline */}
          {routeGeometry && routeGeometry.length > 1 && (
            <Polyline positions={routeGeometry} color='#0284c7' weight={5} opacity={0.8} dashArray='5, 10'>
              <Popup>
                <div className='font-medium'>{selectedBus?.name || (selectedBus?.id ? `Bus ${selectedBus.id.substring(0, 6)}` : 'Bus Route')}</div>
                {selectedBus && (
                  <div className='mt-1 text-sm'>
                    <p>
                      Capacity: {selectedBus.registeredCount || 0}/{selectedBus.capacity || 30}
                    </p>
                    <p className='mt-1'>Stops: {selectedBus.route ? selectedBus.route.length : 0}</p>
                  </div>
                )}
              </Popup>
            </Polyline>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
