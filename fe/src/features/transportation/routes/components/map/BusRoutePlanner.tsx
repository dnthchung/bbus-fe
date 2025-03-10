'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X, Navigation, MapPin, Plus, Search } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, useMap } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEFAULT_POSITION: [number, number] = [16.4637, 107.5909] // Đông Hà, Quảng Trị

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

export default function BusRoutePlanner() {
  const [start, setStart] = useState<[number, number] | null>(null)
  const [end, setEnd] = useState<[number, number] | null>(null)
  const [waypoints, setWaypoints] = useState<[number, number][]>([])
  const [route, setRoute] = useState<[number, number][]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef(null)

  // Get current location
  const getCurrentLocation = (type: 'start' | 'end' | 'waypoint') => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
        if (type === 'start') setStart(coords)
        else if (type === 'end') setEnd(coords)
        else setWaypoints([...waypoints, coords])

        // Center map on the new location
        setMapCenter(coords)
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    )
  }

  // Search location from OpenStreetMap
  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`)
      setSearchResults(response.data)

      if (response.data.length > 0) {
        // Center map on the first result
        const coords: [number, number] = [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]
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
  const selectLocation = (type: 'start' | 'end' | 'waypoint', location: any) => {
    const coords: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)]

    if (type === 'start') setStart(coords)
    else if (type === 'end') setEnd(coords)
    else setWaypoints([...waypoints, coords])

    // Clear search results
    setSearchResults([])
    setSearchQuery('')
  }

  // Generate route along roads using OSRM
  const generateRoute = async () => {
    if (!start || !end) {
      alert('Please select start and end points!')
      return
    }

    setIsLoading(true)
    try {
      let routePoints = [start, ...waypoints, end]
      const coordinates = routePoints.map((point) => `${point[1]},${point[0]}`).join(';')
      // console.log('===> Coordinates:', coordinates)

      // Call OSRM API for road-based routing
      const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`)

      if (response.data.routes && response.data.routes.length > 0) {
        // Extract route geometry (array of [longitude, latitude] pairs)
        const routeGeometry = response.data.routes[0].geometry.coordinates

        // Convert to [latitude, longitude] format for Leaflet
        const convertedRoute = routeGeometry.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
        console.log('===> Route:', convertedRoute)
        setRoute(convertedRoute)
      }
    } catch (error) {
      console.error('Error generating route:', error)
      alert('Error generating route. Please try again or check your points.')
    } finally {
      setIsLoading(false)
    }
  }

  // Custom Map Click Handler Component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng
        const coords: [number, number] = [lat, lng]

        if (!start) {
          setStart(coords)
        } else if (!end) {
          setEnd(coords)
        } else {
          setWaypoints([...waypoints, coords])
        }
      },
    })
    return null
  }

  return (
    <div className='container mx-auto max-w-6xl p-4'>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Bus Route Planner</CardTitle>
          <CardDescription>Plan your bus route with road-based navigation</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Map */}
          <div className='mb-6 overflow-hidden rounded-lg border'>
            <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-96 w-full' scrollWheelZoom={true} ref={mapRef}>
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              <MapController center={mapCenter} zoom={14} />
              <MapClickHandler />

              {start && (
                <Marker
                  position={start}
                  icon={L.divIcon({
                    html: `<div class="bg-green-500 p-2 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: 'custom-div-icon',
                  })}
                />
              )}

              {end && (
                <Marker
                  position={end}
                  icon={L.divIcon({
                    html: `<div class="bg-red-500 p-2 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: 'custom-div-icon',
                  })}
                />
              )}

              {waypoints.map((wp, i) => (
                <Marker
                  key={i}
                  position={wp}
                  icon={L.divIcon({
                    html: `<div class="bg-blue-500 p-2 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: 'custom-div-icon',
                  })}
                />
              ))}

              {route.length > 1 && <Polyline positions={route} color='blue' weight={4} opacity={0.7} />}
            </MapContainer>
          </div>

          {/* Search Bar Below Map */}
          <div className='mb-6'>
            <Label htmlFor='location-search' className='mb-2 block'>
              Tìm kiếm địa điểm
            </Label>
            <div className='flex gap-2'>
              <Input id='location-search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Nhập địa chỉ, thành phố hoặc địa điểm' className='flex-1' onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
              <Button onClick={searchLocation} disabled={isLoading}>
                {isLoading ? 'Đang tìm...' : <Search className='h-4 w-4' />}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className='mt-2 max-h-48 overflow-y-auto rounded-md border'>
                {searchResults.map((result, index) => (
                  <div key={index} className='cursor-pointer border-b p-2 last:border-b-0 hover:bg-slate-100'>
                    <p className='font-medium'>{result.display_name}</p>
                    <div className='mt-1 flex gap-2'>
                      <Button size='sm' variant='outline' onClick={() => selectLocation('start', result)}>
                        Đặt làm điểm bắt đầu
                      </Button>
                      <Button size='sm' variant='outline' onClick={() => selectLocation('end', result)}>
                        Đặt làm điểm kết thúc
                      </Button>
                      <Button size='sm' variant='outline' onClick={() => selectLocation('waypoint', result)}>
                        Thêm điểm dừng
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Start Point */}
            <div className='space-y-2'>
              <Label htmlFor='start-point'>Điểm Bắt Đầu</Label>
              <div className='flex gap-2'>
                <Input id='start-point' value={start ? `${start[0].toFixed(5)}, ${start[1].toFixed(5)}` : ''} readOnly placeholder='Chọn điểm bắt đầu' className='flex-1' />
                <Button variant='outline' onClick={() => getCurrentLocation('start')} title='Sử dụng vị trí hiện tại'>
                  <Navigation className='h-4 w-4' />
                </Button>
                {start && (
                  <Button variant='ghost' className='h-10 w-10 p-0 text-red-500' onClick={() => setStart(null)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            {/* End Point */}
            <div className='space-y-2'>
              <Label htmlFor='end-point'>Điểm Kết Thúc</Label>
              <div className='flex gap-2'>
                <Input id='end-point' value={end ? `${end[0].toFixed(5)}, ${end[1].toFixed(5)}` : ''} readOnly placeholder='Chọn điểm kết thúc' className='flex-1' />
                <Button variant='outline' onClick={() => getCurrentLocation('end')} title='Sử dụng vị trí hiện tại'>
                  <Navigation className='h-4 w-4' />
                </Button>
                {end && (
                  <Button variant='ghost' className='h-10 w-10 p-0 text-red-500' onClick={() => setEnd(null)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Waypoints */}
          <div className='mt-6'>
            <div className='mb-2 flex items-center justify-between'>
              <Label>Điểm Dừng</Label>
              <Button variant='outline' size='sm' onClick={() => getCurrentLocation('waypoint')}>
                <Navigation className='mr-1 h-4 w-4' /> Thêm vị trí hiện tại
              </Button>
            </div>

            {waypoints.length > 0 ? (
              <div className='mt-2 space-y-2'>
                {waypoints.map((wp, index) => (
                  <div key={index} className='flex items-center gap-2 rounded bg-slate-50 p-2'>
                    <Input value={`${wp[0].toFixed(5)}, ${wp[1].toFixed(5)}`} readOnly className='flex-1' />
                    <Button variant='ghost' size='sm' onClick={() => setWaypoints(waypoints.filter((_, i) => i !== index))} className='h-8 w-8 p-0 text-red-500'>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm italic text-slate-500'>Chưa có điểm dừng nào. Nhấp vào bản đồ hoặc tìm kiếm địa điểm để thêm điểm dừng.</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={generateRoute} className='w-full' disabled={!start || !end || isLoading} size='lg'>
            {isLoading ? 'Đang tạo tuyến đường...' : 'Tạo tuyến đường'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
