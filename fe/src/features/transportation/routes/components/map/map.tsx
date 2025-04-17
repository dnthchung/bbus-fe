'use client'

// path: fe/src/features/transportation/routes/components/map.tsx
import { useEffect } from 'react'
import type { BusStop, Bus } from '@/types/bus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'

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

// Component to recenter map when selected stop changes
function MapUpdater({ selectedStop }: { selectedStop: BusStop | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedStop) {
      map.setView([selectedStop.lat, selectedStop.lng], 14)
    }
  }, [selectedStop, map])

  return null
}

interface MapProps {
  busStops: BusStop[]
  selectedStop: BusStop | null
  buses: Bus[]
  onSelectStop: (stop: BusStop) => void
}

export default function Map({ busStops, selectedStop, buses, onSelectStop }: MapProps) {
  // Default center position (can be adjusted to your region)
  const defaultCenter: [number, number] = [21.0285, 105.8542] // Hanoi coordinates

  // Generate different colors for each bus route
  const getBusColor = (busId: number) => {
    const colors = ['#3388ff', '#ff3333', '#33ff33', '#ff33ff', '#ffff33', '#33ffff']
    return colors[busId % colors.length]
  }

  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    ;(async function init() {
      // @ts-ignore - Leaflet types are not perfect
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })
    })()
  }, [])

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

  // Custom marker icon for bus stops - red pin like in the image
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

  // Custom marker icon for selected bus stop
  const selectedStopIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z" fill="#1976d2" stroke="#0d47a1" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    </div>`,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -45],
  })

  // Show all bus routes that pass through the selected stop
  const selectedStopBusRoutes = selectedStop ? buses.filter((bus) => bus.route.some((stop) => stop.id === selectedStop.id)) : []

  return (
    <div className='relative h-full w-full'>
      <MapContainer center={defaultCenter} zoom={13} className='z-0' attributionControl={false} zoomControl={true}>
        <TileLayer attribution='' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* Bus stops markers - without labels */}
        {busStops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={selectedStop?.id === stop.id ? selectedStopIcon : busStopIcon}
            eventHandlers={{
              click: () => onSelectStop(stop),
            }}
          >
            <Popup>
              <div className='font-medium'>{stop.name}</div>
              <div className='text-sm'>Students: {stop.studentCount}</div>
              {stop.buses && stop.buses.length > 0 && <div className='mt-1 text-sm'>Buses: {stop.buses.join(', ')}</div>}
            </Popup>
          </Marker>
        ))}

        {/* Show all bus routes that pass through the selected stop */}
        {selectedStopBusRoutes.map((bus) => (
          <Polyline key={bus.id} positions={bus.route.map((stop) => [stop.lat, stop.lng])} color={getBusColor(bus.id)} weight={4} opacity={0.7}>
            <Popup>
              <div className='font-medium'>Bus {bus.id}</div>
              <div className='text-sm'>
                Capacity: {bus.registeredCount}/{bus.capacity}
              </div>
              <div className='mt-1 text-sm'>Stops: {bus.route.map((stop) => stop.name).join(' → ')}</div>
            </Popup>
          </Polyline>
        ))}

        {/* Update map center when selected stop changes */}
        <MapUpdater selectedStop={selectedStop} />
      </MapContainer>
    </div>
  )
}
