// fe/src/features/buses/data/schema.ts
import { z } from 'zod'

const busStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type BusStatus = z.infer<typeof busStatusSchema>

export const busSchema = z.object({
  id: z.string().uuid(),
  licensePlate: z.string().nullable(),
  name: z.string(),
  driverId: z.string().uuid().nullable(),
  driverName: z.string().nullable(),
  driverPhone: z.string().nullable(),
  assistantId: z.string().uuid().nullable(),
  assistantName: z.string().nullable(),
  assistantPhone: z.string().nullable(),
  routeId: z.string().uuid().nullable(),
  routeCode: z.string().nullable(),
  espId: z.string().nullable(),
  cameraFacesluice: z.string().nullable(),
  busStatus: busStatusSchema,
  amountOfStudents: z.number(),
})

export type Bus = z.infer<typeof busSchema>
export const busListSchema = z.array(busSchema)
