"use client"

import { useRef, useEffect } from "react"

interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  status: string
  studentCount?: number
}

interface SimpleMapProps {
  checkpoints: Checkpoint[]
  center: { lat: number; lng: number }
}

export default function SimpleMap({ checkpoints, center }: SimpleMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Convert geo coordinates to pixel coordinates
  const geoToPixel = (
    lat: number,
    lng: number,
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
    width: number,
    height: number,
  ) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
    const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
    return { x, y }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (checkpoints.length === 0) {
      // Draw empty state message
      ctx.fillStyle = "#9ca3af"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Add checkpoints to preview route", canvas.width / 2, canvas.height / 2)
      return
    }

    // Calculate bounds with padding
    const padding = 0.02 // padding in degrees
    let minLat = Math.min(...checkpoints.map((cp) => cp.latitude)) - padding
    let maxLat = Math.max(...checkpoints.map((cp) => cp.latitude)) + padding
    let minLng = Math.min(...checkpoints.map((cp) => cp.longitude)) - padding
    let maxLng = Math.max(...checkpoints.map((cp) => cp.longitude)) + padding

    // Ensure minimum area to prevent zero division
    const minArea = 0.01
    if (maxLat - minLat < minArea) {
      const mid = (maxLat + minLat) / 2
      minLat = mid - minArea / 2
      maxLat = mid + minArea / 2
    }
    if (maxLng - minLng < minArea) {
      const mid = (maxLng + minLng) / 2
      minLng = mid - minArea / 2
      maxLng = mid + minArea / 2
    }

    const bounds = { minLat, maxLat, minLng, maxLng }

    // Draw route line
    if (checkpoints.length > 1) {
      ctx.beginPath()
      const start = geoToPixel(checkpoints[0].latitude, checkpoints[0].longitude, bounds, canvas.width, canvas.height)
      ctx.moveTo(start.x, start.y)

      for (let i = 1; i < checkpoints.length; i++) {
        const point = geoToPixel(checkpoints[i].latitude, checkpoints[i].longitude, bounds, canvas.width, canvas.height)
        ctx.lineTo(point.x, point.y)
      }

      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Draw checkpoints
    checkpoints.forEach((checkpoint, index) => {
      const { x, y } = geoToPixel(checkpoint.latitude, checkpoint.longitude, bounds, canvas.width, canvas.height)

      // Draw marker circle
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Draw number
      ctx.fillStyle = "white"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText((index + 1).toString(), x, y)

      // Draw checkpoint name on hover (simplified)
      if (index === 0 || index === checkpoints.length - 1) {
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"
        ctx.fillText(checkpoint.name, x, y - 15)
      }
    })

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [checkpoints, center])

  return (
    <div className="w-full h-full bg-gray-50 relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      {checkpoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Add checkpoints to preview route
        </div>
      )}
    </div>
  )
}
