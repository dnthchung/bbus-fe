'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import { Loader2, AlertTriangle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getListCheckpointByRouteId, getNumberOfStudentInEachCheckpoint } from '@/features/transportation/function'
import './map.css'

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

// Component to handle routing between checkpoints
function RoutingMachine({ checkpoints }: { checkpoints: Checkpoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (!checkpoints || checkpoints.length < 2) return

    // Remove any existing routing control
    map.eachLayer((layer) => {
      // @ts-ignore - Type checking for instanceof L.Routing.Control
      if (layer instanceof L.Routing.Control) {
        // map.removeLayer(layer)
        map.removeControl(routingControl)
      }
    })

    // Filter out invalid checkpoints
    const validCheckpoints = checkpoints.filter((cp) => !cp.isInvalid)

    if (validCheckpoints.length < 2) return

    // Create waypoints from valid checkpoints - properly formatted as Waypoint objects
    const waypoints = validCheckpoints.map((cp) => {
      const latLng = L.latLng(Number.parseFloat(cp.latitude as string), Number.parseFloat(cp.longitude as string))
      // Return a properly formatted Waypoint object
      return {
        latLng: latLng,
        name: cp.name,
      } as L.Routing.Waypoint
    })

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#3b82f6', opacity: 0.8, weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, // Don't create markers, we'll handle that separately
      addWaypoints: false, // Disable adding waypoints by clicking
    }).addTo(map)

    // Hide the routing instructions
    const container = routingControl.getContainer()
    if (container) {
      container.style.display = 'none'
    }

    return () => {
      map.removeControl(routingControl)
    }
  }, [checkpoints, map])

  return null
}

// Update the Checkpoint interface to allow both string and number types for coordinates
interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: string | number
  longitude: string | number
  status: string
  studentCount?: number
  isInvalid?: boolean
}

interface RouteMapProps {
  selectedRouteId?: string
  checkpoints?: Checkpoint[]
  className?: string
}

export default function RouteMap({ selectedRouteId, checkpoints = [], className }: RouteMapProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.0285, 105.8542]) // Default to Hanoi
  const [routeCheckpoints, setRouteCheckpoints] = useState<Checkpoint[]>([])

  // Fix for Leaflet marker icons in React
  useEffect(() => {
    // Fix Leaflet icon issue - using type assertion to avoid TypeScript error
    const IconDefault = L.Icon.Default as any
    delete IconDefault.prototype._getIconUrl

    IconDefault.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
  }, [])

  // Custom marker icons
  const checkpointIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
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

  // Update the useEffect for checkpoints, modify the processing to maintain string types
  useEffect(() => {
    if (checkpoints && checkpoints.length > 0) {
      // Process checkpoints
      const processedCheckpoints = checkpoints.map((checkpoint) => {
        const lat = Number.parseFloat(checkpoint.latitude as string)
        const lng = Number.parseFloat(checkpoint.longitude as string)
        const isInvalid = isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0

        // Show toast for invalid checkpoints
        if (isInvalid) {
          toast({
            title: 'Cảnh báo',
            description: `Điểm dừng "${checkpoint.name}" có tọa độ không hợp lệ. Vui lòng kiểm tra lại.`,
            variant: 'deny',
          })
        }

        return {
          ...checkpoint,
          isInvalid,
        }
      })

      setRouteCheckpoints(processedCheckpoints)

      // Set map center to first valid checkpoint
      const validCheckpoint = processedCheckpoints.find((cp) => !cp.isInvalid)
      if (validCheckpoint) {
        const lat = Number.parseFloat(validCheckpoint.latitude as string)
        const lng = Number.parseFloat(validCheckpoint.longitude as string)
        setMapCenter([lat, lng])
      }

      setError(null)
    } else {
      setRouteCheckpoints([])
    }
  }, [checkpoints, toast])

  // Fetch route details when selectedRouteId changes but no checkpoints are provided
  useEffect(() => {
    async function fetchRouteDetails() {
      if (!selectedRouteId || checkpoints.length > 0) return

      try {
        setLoading(true)
        setError(null)

        // Get checkpoints for this route directly
        const checkpointsData = await getListCheckpointByRouteId(selectedRouteId)

        if (!checkpointsData || checkpointsData.length === 0) {
          setError('Tuyến đường không có điểm dừng nào')
          setRouteCheckpoints([])
          return
        }

        // Get student count for each checkpoint
        const checkpointsWithStudentCount = await Promise.all(
          checkpointsData.map(async (checkpoint: Checkpoint) => {
            try {
              const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)

              // Check if coordinates are valid
              const lat = Number.parseFloat(checkpoint.latitude as string)
              const lng = Number.parseFloat(checkpoint.longitude as string)
              const isInvalid = isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0

              // Show toast for invalid checkpoints
              if (isInvalid) {
                toast({
                  title: 'Cảnh báo',
                  description: `Điểm dừng "${checkpoint.name}" có tọa độ không hợp lệ. Vui lòng kiểm tra lại.`,
                  variant: 'deny',
                })
              }

              return {
                ...checkpoint,
                studentCount: studentCount || 0,
                isInvalid,
              }
            } catch (error) {
              console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
              return {
                ...checkpoint,
                studentCount: 0,
                isInvalid: false,
              }
            }
          })
        )

        setRouteCheckpoints(checkpointsWithStudentCount)

        // Set map center to first valid checkpoint
        const validCheckpoint = checkpointsWithStudentCount.find((cp) => !cp.isInvalid)
        if (validCheckpoint) {
          setMapCenter([Number.parseFloat(validCheckpoint.latitude as string), Number.parseFloat(validCheckpoint.longitude as string)])
        }

        // Check if there are any invalid checkpoints
        const hasInvalidCheckpoints = checkpointsWithStudentCount.some((cp) => cp.isInvalid)
        if (hasInvalidCheckpoints) {
          toast({
            title: 'Cảnh báo',
            description: 'Một số điểm dừng có tọa độ không hợp lệ. Vui lòng kiểm tra lại.',
            variant: 'deny',
          })
        }
      } catch (err) {
        console.error('Error fetching route details:', err)
        setError('Không thể tải thông tin tuyến đường')
      } finally {
        setLoading(false)
      }
    }

    fetchRouteDetails()
  }, [selectedRouteId, checkpoints, toast])

  return (
    <Card className={`flex h-full flex-col ${className}`}>
      <CardHeader className='pb-2'>
        <CardTitle>Bản đồ tuyến đường</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col p-0'>
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
        <div className='relative flex-1 p-4'>
          {loading && (
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

            {/* Add routing machine for actual routes */}
            {routeCheckpoints.length > 1 && <RoutingMachine checkpoints={routeCheckpoints} />}

            {/* Render checkpoints */}
            {routeCheckpoints.map((checkpoint, index) => (
              <Marker key={checkpoint.id} position={[Number.parseFloat(checkpoint.latitude as string), Number.parseFloat(checkpoint.longitude as string)]} icon={checkpoint.isInvalid ? invalidCheckpointIcon : checkpointIcon}>
                <Popup>
                  <div>
                    <div className='font-medium'>{checkpoint.name}</div>
                    {checkpoint.description && <div className='text-sm text-muted-foreground'>{checkpoint.description}</div>}
                    <div className='mt-1 text-sm'>Điểm dừng #{index + 1}</div>
                    {checkpoint.studentCount !== undefined && <div className='mt-1 text-sm font-medium'>Số học sinh: {checkpoint.studentCount}</div>}
                    {checkpoint.isInvalid && <div className='mt-1 text-sm font-medium text-amber-600'>Vị trí không hợp lệ</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
