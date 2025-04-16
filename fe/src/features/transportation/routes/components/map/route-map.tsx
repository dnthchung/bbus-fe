'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Loader2, AlertTriangle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllRoute, getRouteByRouteId, getListCheckpointByRouteId, getCheckpointDetailByCheckpointId } from '@/features/transportation/function'

// Add custom CSS to hide attribution
const customMapStyles = `
.leaflet-control-attribution {
  display: none !important;
}
.leaflet-container {
  height: 100% !important;
  width: 100% !important;
  z-index: 0 !important;
}
`

// Component to recenter map when route changes
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [center, map])

  return null
}

interface RouteMapProps {
  className?: string
}

export default function RouteMap({ className }: RouteMapProps) {
  const { toast } = useToast()
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null)
  const [checkpoints, setCheckpoints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [routeLoading, setRouteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.0285, 105.8542]) // Default to Hanoi

  // Fix for Leaflet marker icons in React
  useEffect(() => {
    // Add custom CSS
    const styleElement = document.createElement('style')
    styleElement.textContent = customMapStyles
    document.head.appendChild(styleElement)

    // Fix Leaflet icon issue - using type assertion to avoid TypeScript error
    const IconDefault = L.Icon.Default as any
    delete IconDefault.prototype._getIconUrl

    IconDefault.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Custom marker icons
  const checkpointIcon = new L.DivIcon({
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

  const invalidCheckpointIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })

  // Fetch all routes
  useEffect(() => {
    async function fetchRoutes() {
      try {
        setLoading(true)
        const routesData = await getAllRoute()
        setRoutes(routesData)
        setError(null)
      } catch (err) {
        console.error('Error fetching routes:', err)
        setError('Không thể tải danh sách tuyến đường')
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách tuyến đường',
          variant: 'deny',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [toast])

  // Fetch route details and checkpoints when a route is selected
  useEffect(() => {
    async function fetchRouteDetails() {
      if (!selectedRoute) return

      try {
        setRouteLoading(true)
        setError(null)

        // Get route details
        const routeDetails = await getRouteByRouteId(selectedRoute.id)

        // Get checkpoints for this route
        const checkpointsData = await getListCheckpointByRouteId(selectedRoute.id)

        if (!checkpointsData || checkpointsData.length === 0) {
          setError(`Tuyến đường ${selectedRoute.code} không có điểm dừng nào`)
          setCheckpoints([])
          return
        }

        // Process path to get ordered checkpoints
        const path = routeDetails.path
        if (!path) {
          setError(`Tuyến đường ${selectedRoute.code} không có đường đi`)
          setCheckpoints([])
          return
        }

        const checkpointIds = path.split(' ')
        const orderedCheckpoints = []
        let hasInvalidCheckpoints = false

        // Get details for each checkpoint in the path
        for (const id of checkpointIds) {
          try {
            const checkpointDetail = await getCheckpointDetailByCheckpointId(id)
            if (checkpointDetail) {
              // Validate coordinates
              const lat = Number.parseFloat(checkpointDetail.latitude)
              const lng = Number.parseFloat(checkpointDetail.longitude)

              if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                orderedCheckpoints.push({
                  ...checkpointDetail,
                  latitude: lat || 0,
                  longitude: lng || 0,
                  isInvalid: true,
                })
                hasInvalidCheckpoints = true
              } else {
                orderedCheckpoints.push({
                  ...checkpointDetail,
                  latitude: lat,
                  longitude: lng,
                  isInvalid: false,
                })
              }
            }
          } catch (err) {
            console.error(`Error fetching checkpoint ${id}:`, err)
            hasInvalidCheckpoints = true
          }
        }

        setCheckpoints(orderedCheckpoints)

        // Set map center to first valid checkpoint
        const validCheckpoint = orderedCheckpoints.find((cp) => !cp.isInvalid)
        if (validCheckpoint) {
          setMapCenter([Number.parseFloat(validCheckpoint.latitude), Number.parseFloat(validCheckpoint.longitude)])
        }

        // Show warning if there are invalid checkpoints
        if (hasInvalidCheckpoints) {
          toast({
            title: 'Cảnh báo',
            description: 'Một số điểm dừng có vị trí không hợp lệ',
            variant: 'deny',
          })
        }
      } catch (err) {
        console.error('Error fetching route details:', err)
        setError(`Không thể tải thông tin tuyến đường ${selectedRoute.code}`)
        toast({
          title: 'Lỗi',
          description: `Không thể tải thông tin tuyến đường ${selectedRoute.code}`,
          variant: 'deny',
        })
      } finally {
        setRouteLoading(false)
      }
    }

    fetchRouteDetails()
  }, [selectedRoute, toast])

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <Card className='flex h-full flex-col'>
        <CardHeader className='pb-3'>
          <CardTitle>Bản đồ tuyến đường</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-1 flex-col p-0'>
          {/* Route selector */}
          <div className='px-4 pb-3'>
            <div className='mb-2 text-sm font-medium'>Chọn tuyến đường:</div>
            <div className='flex max-h-24 flex-wrap gap-2 overflow-y-auto'>
              {loading ? (
                <div className='flex w-full items-center justify-center py-2'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Đang tải...</span>
                </div>
              ) : routes.length > 0 ? (
                routes.map((route) => (
                  <Button key={route.id} size='sm' variant={selectedRoute?.id === route.id ? 'default' : 'outline'} onClick={() => setSelectedRoute(route)}>
                    {route.code}
                  </Button>
                ))
              ) : (
                <div className='text-sm text-muted-foreground'>Không có tuyến đường nào</div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className='px-4 pb-3'>
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Map */}
          <div className='relative flex-1'>
            {routeLoading && (
              <div className='absolute inset-0 z-10 flex items-center justify-center bg-background/80'>
                <div className='flex flex-col items-center'>
                  <Loader2 className='mb-2 h-8 w-8 animate-spin' />
                  <span>Đang tải thông tin tuyến đường...</span>
                </div>
              </div>
            )}

            <MapContainer center={mapCenter} zoom={13} className='h-full w-full' attributionControl={false}>
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='' />

              <MapUpdater center={mapCenter} />

              {/* Render checkpoints */}
              {checkpoints.map((checkpoint, index) => (
                <Marker key={checkpoint.id} position={[Number.parseFloat(checkpoint.latitude), Number.parseFloat(checkpoint.longitude)]} icon={checkpoint.isInvalid ? invalidCheckpointIcon : checkpointIcon}>
                  <Popup>
                    <div>
                      <div className='font-medium'>{checkpoint.name}</div>
                      {checkpoint.description && <div className='text-sm text-muted-foreground'>{checkpoint.description}</div>}
                      <div className='mt-1 text-sm'>Điểm dừng #{index + 1}</div>
                      {checkpoint.isInvalid && <div className='mt-1 text-sm font-medium text-amber-600'>Vị trí không hợp lệ</div>}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Render route line */}
              {checkpoints.length > 1 && <Polyline positions={checkpoints.map((cp) => [Number.parseFloat(cp.latitude), Number.parseFloat(cp.longitude)])} color='#3b82f6' weight={4} opacity={0.7} />}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
