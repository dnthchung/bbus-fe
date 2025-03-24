'use client'

// path: fe/src/features/transportation/routes/components/map/draggable-bus-route-planner.tsx
import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import type { Bus, BusStop } from '@/types/bus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, Plus, MapPin, Loader2 } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, useMap, Popup, Tooltip } from 'react-leaflet'
import { Button } from '@/components/ui/button'
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
  busStops: BusStop[]
  onUpdateBusStop: (stopId: number, newPosition: [number, number]) => void
  onAddBusStop: (position: [number, number], name: string) => void
  selectedBusId?: number
  selectedBus?: Bus | null
  routeGeometry?: [number, number][]
}

export default function DraggableBusRoutePlanner({ busStops, onUpdateBusStop, onAddBusStop, selectedBusId, selectedBus, routeGeometry }: BusRoutePlannerProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newStopName, setNewStopName] = useState('')
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null)
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const mapRef = useRef(null)

  // Create custom icons
  const busStopIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#e53935" stroke="#b71c1c" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
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
  const searchLocation = async () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`)
      setSearchResults(response.data)
      if (response.data.length > 0) {
        const coords: [number, number] = [Number.parseFloat(response.data[0].lat), Number.parseFloat(response.data[0].lon)]
        setMapCenter(coords)
      }
    } catch (error) {
      console.error('Error searching location:', error)
      alert('Error searching location. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Select location from search results
  const selectLocation = (location: any) => {
    const coords: [number, number] = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
    setTempMarker(coords)
    setNewStopName(location.display_name.split(',')[0])
    setMapCenter(coords)
    setSearchResults([])
    setSearchQuery('')
  }

  // Handle marker drag end
  const handleMarkerDragEnd = (stopId: number, newPosition: [number, number]) => {
    onUpdateBusStop(stopId, newPosition)
  }

  // Handle map click to add temporary marker
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng
        const coords: [number, number] = [lat, lng]
        setTempMarker(coords)
      },
    })
    return null
  }

  // Add new bus stop
  const addNewBusStop = () => {
    if (tempMarker && newStopName) {
      onAddBusStop(tempMarker, newStopName)
      setTempMarker(null)
      setNewStopName('')
    } else {
      alert('Please provide a name for the new bus stop')
    }
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
      {/* Search Bar - Moved to top and reduced size to 1/2 */}
      <div className='mb-2 flex justify-center'>
        <div className='flex w-1/2 gap-2'>
          <Input id='location-search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search for location...' className='flex-1' onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
          <Button onClick={searchLocation} disabled={isLoading}>
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Search className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      {/* Search Results - now below search bar but above map */}
      {searchResults.length > 0 && (
        <div className='mb-2 flex justify-center'>
          <div className='max-h-48 w-1/2 overflow-y-auto rounded-md border bg-background shadow-sm'>
            {searchResults.map((result, index) => (
              <div key={index} className='cursor-pointer border-b p-2 transition-colors last:border-b-0 hover:bg-muted/50'>
                <p className='font-medium'>{result.display_name}</p>
                <div className='mt-1'>
                  <Button size='sm' variant='outline' onClick={() => selectLocation(result)}>
                    <MapPin className='mr-1 h-4 w-4' /> Set as stop
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className='relative flex-1 overflow-hidden rounded-lg'>
        <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-full w-full' scrollWheelZoom={true} ref={mapRef} attributionControl={false} zoomControl={true}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='' />
          <MapController center={mapCenter} zoom={14} />
          <MapClickHandler />

          {/* Existing bus stops */}
          {busStops.map((stop) => (
            <DraggableMarker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              onDragEnd={(pos) => handleMarkerDragEnd(stop.id, pos)}
              icon={busStopIcon}
              popupContent={
                <div className='text-center'>
                  <h3 className='font-medium'>{stop.name}</h3>
                  <p className='text-sm text-muted-foreground'>Students: {stop.studentCount}</p>
                  <p className='mt-1 text-xs'>Drag to change position</p>
                </div>
              }
            />
          ))}

          {/* Temporary marker for new stop */}
          {tempMarker && (
            <DraggableMarker
              position={tempMarker}
              onDragEnd={(pos) => setTempMarker(pos)}
              icon={tempMarkerIcon}
              popupContent={
                <div className='flex flex-col gap-2 p-2'>
                  <Input placeholder='Stop name' value={newStopName} onChange={(e) => setNewStopName(e.target.value)} className='min-w-[200px]' />
                  <Button size='sm' onClick={addNewBusStop}>
                    <Plus className='mr-1 h-4 w-4' /> Add Stop
                  </Button>
                </div>
              }
            />
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
            <Polyline positions={routeGeometry} color='#ea580c' weight={5} opacity={0.9}>
              <Popup>
                <div className='font-medium'>OSRM Route</div>
                {selectedBus && (
                  <div className='mt-1 text-sm'>
                    Bus {selectedBus.id} (Capacity: {selectedBus.registeredCount}/{selectedBus.capacity})
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
