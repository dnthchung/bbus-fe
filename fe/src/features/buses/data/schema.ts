// fe/src/features/buses/data/schema.ts
import { z } from 'zod'

export const busSchema = z.object({
  id: z.string().uuid(), // UUID của xe buýt
  licensePlate: z.string(), // Biển số xe
  name: z.string(), // Tên xe buýt
  driverId: z.string().uuid(), // UUID tài xế
  driverName: z.string(), // Tên tài xế
  route: z.string(), // Tuyến đường
  espId: z.string(), // ID của thiết bị ESP
  cameraFacesluice: z.string(), // ID của camera nhận diện khuôn mặt
})

export type Bus = z.infer<typeof busSchema>
export const busListSchema = z.array(busSchema)
