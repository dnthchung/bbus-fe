//path : fe/src/features/transportation/schema.ts
import { z } from 'zod'

/** Status enum for checkpoints */
const checkpointStatusSchema = z.union([
  z.literal('ACTIVE'), // Điểm dừng xe buýt đang hoạt động
  z.literal('INACTIVE'), // Điểm dừng xe buýt không hoạt động
])

// Định nghĩa schema cho một điểm dừng xe buýt (Checkpoint)
export const checkpointSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  latitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, {
    message: 'Vĩ độ không hợp lệ.',
  }),
  longitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, {
    message: 'Kinh độ không hợp lệ.',
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: checkpointStatusSchema,
})

export type Checkpoint = z.infer<typeof checkpointSchema>
export type CheckpointStatus = z.infer<typeof checkpointStatusSchema>
export const checkpointListSchema = z.array(checkpointSchema)

/** Route schema */
export const routeSchema = z.object({
  id: z.string().uuid(),
  code: z.string().max(255),
  description: z.string().max(255).optional(),
  path: z.string().max(255).optional(),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

export type Route = z.infer<typeof routeSchema>
export const routeListSchema = z.array(routeSchema)
