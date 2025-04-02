// fe/src/features/buses/data/schema.ts
import { z } from 'zod'

const busStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type BusStatus = z.infer<typeof busStatusSchema>

export const busSchema = z.object({
  id: z.string().uuid(), // UUID của xe buýt
  licensePlate: z.string().nullable(), // Biển số xe (nullable trong DB)
  name: z.string(), // Tên xe buýt
  driverId: z.string().uuid().nullable(), // UUID tài xế
  assistantId: z.string().uuid().nullable(), // UUID phụ tá (nullable)
  routeId: z.string().uuid().nullable(), // Tuyến đường
  espId: z.string().nullable(), // ID thiết bị ESP
  cameraFacesluice: z.string().nullable(), // ID camera khuôn mặt
  status: busStatusSchema, // Trạng thái
  amountOfStudent: z.number(), // Số học sinh hiện tại
  maxCapacity: z.number(), // Sức chứa tối đa
  createdAt: z.string().datetime(), // Ngày tạo
  updatedAt: z.string().datetime(), // Ngày cập nhật
})

export type Bus = z.infer<typeof busSchema>
export const busListSchema = z.array(busSchema)
