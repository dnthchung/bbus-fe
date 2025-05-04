'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  status: string
  studentCount?: number
}

interface LeafletMapProps {
  checkpoints: Checkpoint[]
}

const SCHOOL_ID = 'fdcb7b87-7cf4-4648-820e-b86ca2e4aa88'

const schoolIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="position:relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z"
              fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
})

// Component to fit map bounds to markers
function FitBounds({ checkpoints }: { checkpoints: Checkpoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (checkpoints.length > 0) {
      const bounds = L.latLngBounds(checkpoints.map((cp) => [cp.latitude, cp.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [checkpoints, map])

  return null
}

// Component to handle routing between checkpoints
function RoutingControl({ checkpoints }: { checkpoints: Checkpoint[] }) {
  const map = useMap()
  const routingControlRef = useRef<L.Routing.Control | null>(null)

  useEffect(() => {
    if (checkpoints.length < 2) {
      // Remove existing routing control if there are fewer than 2 checkpoints
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      return
    }

    // Create waypoints from checkpoints
    const waypoints = checkpoints.map((cp) => L.Routing.waypoint(L.latLng(cp.latitude, cp.longitude), cp.name))

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current)
    }

    // Create new routing control
    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      show: false, // Hide the routing instructions panel
      lineOptions: {
        styles: [
          { color: '#3b82f6', opacity: 0.8, weight: 5 },
          { color: '#2563eb', opacity: 0.9, weight: 3 },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => {
        return null // Don't create default markers, we'll add our own
      },
    }).addTo(map)

    // Store the routing control reference
    routingControlRef.current = routingControl

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
      }
    }
  }, [checkpoints, map])

  return null
}

// Custom marker icon with number
const createNumberedIcon = (index: number) =>
  new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position:relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z"
                fill="#3b82f6" stroke="#2563eb" stroke-width="1"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>
        <span style="
          position:absolute;
          top:4px; left:0;
          width:24px; text-align:center;
          font-size:12px; font-weight:700;
          color:#1e3a8a;">
          ${index}
        </span>
      </div>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })

export default function LeafletMap({ checkpoints }: LeafletMapProps) {
  // Default center (Ho Chi Minh City)
  const defaultCenter: [number, number] = [10.762622, 106.660172]

  // Calculate center if checkpoints exist
  const center = checkpoints.length > 0 ? ([checkpoints.reduce((sum, cp) => sum + cp.latitude, 0) / checkpoints.length, checkpoints.reduce((sum, cp) => sum + cp.longitude, 0) / checkpoints.length] as [number, number]) : defaultCenter

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Fix Leaflet icon issues
      delete (L.Icon.Default.prototype as any)._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })
    }
  }, [isClient])

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

      {/* Fit map to markers */}
      {checkpoints.length > 0 && <FitBounds checkpoints={checkpoints} />}

      {/* Add routing between checkpoints */}
      {checkpoints.length > 1 && <RoutingControl checkpoints={checkpoints} />}

      {/* Place markers for each checkpoint */}
      {checkpoints.map((checkpoint, index) => {
        const isSchool = checkpoint.id === SCHOOL_ID
        return (
          <Marker key={checkpoint.id} position={[checkpoint.latitude, checkpoint.longitude]} icon={isSchool ? schoolIcon : createNumberedIcon(index + 1)}>
            <Popup>
              <div className='p-1'>
                <h3 className='font-medium'>{checkpoint.name}</h3>
                <p className='text-xs text-gray-600'>{checkpoint.description}</p>
                {checkpoint.studentCount !== undefined && (
                  <p className='mt-1 text-xs'>
                    <span className='font-medium'>Students:</span> {checkpoint.studentCount}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Show message when no checkpoints */}
      {checkpoints.length === 0 && (
        <div className='pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center bg-white bg-opacity-70'>
          <div className='p-4 text-center'>
            <p className='text-gray-500'>Add checkpoints to preview route</p>
          </div>
        </div>
      )}
    </MapContainer>
  )
}
