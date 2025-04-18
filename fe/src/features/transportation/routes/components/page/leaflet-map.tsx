"use client"

import { useEffect, useState } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

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

// Custom marker icon with number
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

export default function LeafletMap({ checkpoints }: LeafletMapProps) {
  // Default center (Ho Chi Minh City)
  const defaultCenter: [number, number] = [10.762622, 106.660172]

  // Calculate center if checkpoints exist
  const center =
    checkpoints.length > 0
      ? ([
          checkpoints.reduce((sum, cp) => sum + cp.latitude, 0) / checkpoints.length,
          checkpoints.reduce((sum, cp) => sum + cp.longitude, 0) / checkpoints.length,
        ] as [number, number])
      : defaultCenter

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Fix Leaflet icon issues
      delete (L.Icon.Default.prototype as any)._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }
  }, [isClient])

  // Create polyline positions from checkpoints
  const polylinePositions = checkpoints.map((cp) => [cp.latitude, cp.longitude] as [number, number])

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fit map to markers */}
      {checkpoints.length > 0 && <FitBounds checkpoints={checkpoints} />}

      {/* Draw route line */}
      {checkpoints.length > 1 && <Polyline positions={polylinePositions} pathOptions={{ color: "blue", weight: 4 }} />}

      {/* Place markers for each checkpoint */}
      {checkpoints.map((checkpoint, index) => (
        <Marker
          key={checkpoint.id}
          position={[checkpoint.latitude, checkpoint.longitude]}
          icon={createNumberedIcon(index + 1)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{checkpoint.name}</h3>
              <p className="text-xs text-gray-600">{checkpoint.description}</p>
              {checkpoint.studentCount !== undefined && (
                <p className="text-xs mt-1">
                  <span className="font-medium">Students:</span> {checkpoint.studentCount}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Show message when no checkpoints */}
      {checkpoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-[1000] pointer-events-none">
          <div className="text-center p-4">
            <p className="text-gray-500">Add checkpoints to preview route</p>
          </div>
        </div>
      )}
    </MapContainer>
  )
}
