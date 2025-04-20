'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { Checkpoint } from '../data/schema'
import './map.css'

// Default position (Hà Nội)
const DEFAULT_POSITION: [number, number] = [21.0285, 105.8542]

// Component to update map view when selected checkpoint changes
const MapController = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15)
    }
  }, [center, zoom, map])

  return null
}

interface CheckpointMapProps {
  checkpoints: Checkpoint[]
  selectedCheckpoint?: Checkpoint | null
  onCheckpointClick?: (checkpoint: Checkpoint) => void
  height?: string
}

export function CheckpointMap({ checkpoints, selectedCheckpoint, onCheckpointClick, height = '500px' }: CheckpointMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION)

  // Update map center when selected checkpoint changes
  useEffect(() => {
    if (selectedCheckpoint) {
      setMapCenter([Number.parseFloat(selectedCheckpoint.latitude), Number.parseFloat(selectedCheckpoint.longitude)])
    }
  }, [selectedCheckpoint])

  return (
    <div className='rounded-lg border shadow-sm' style={{ height }}>
      <MapContainer center={DEFAULT_POSITION} zoom={13} className='h-full w-full rounded-lg' scrollWheelZoom={true}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <MapController center={mapCenter} />

        {checkpoints.map((checkpoint) => {
          const position: [number, number] = [Number.parseFloat(checkpoint.latitude), Number.parseFloat(checkpoint.longitude)]

          const isSelected = selectedCheckpoint?.id === checkpoint.id

          return (
            <Marker
              key={checkpoint.id}
              position={position}
              icon={L.divIcon({
                html: `<div class="${isSelected ? 'bg-primary' : checkpoint.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'} p-1 rounded-full border-2 border-background shadow-lg ${isSelected ? 'w-5 h-5' : 'w-3 h-3'}"></div>`,
                className: 'custom-div-icon',
              })}
              eventHandlers={{
                click: () => onCheckpointClick && onCheckpointClick(checkpoint),
              }}
            >
              <Popup>
                <div className='p-1'>
                  <h3 className='font-medium'>{checkpoint.name}</h3>
                  <p className='text-xs text-muted-foreground'>{checkpoint.description}</p>
                  <div className='mt-1 text-xs'>
                    <p>Vĩ độ: {checkpoint.latitude}</p>
                    <p>Kinh độ: {checkpoint.longitude}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
