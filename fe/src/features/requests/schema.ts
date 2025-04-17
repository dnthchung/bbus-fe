// Path: d:\Workspace\Github_folder\bbus-fe\fe\src\features\requests\schema.ts
import { z } from 'zod'

const requestSchema = z.object({
  requestId: z.string().uuid(),
  requestTypeId: z.string().uuid(),
  requestTypeName: z.string(),
  studentId: z.string().uuid().nullable(),
  studentName: z.string().nullable(),
  sendByUserId: z.string().uuid(),
  checkpointId: z.string().uuid(),
  checkpointName: z.string(),
  approvedByUserId: z.string().uuid(),
  approvedByName: z.string(),
  fromDate: z.string().datetime().nullable(),
  toDate: z.string().datetime().nullable(),
  reason: z.string(),
  reply: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})

export type Request = z.infer<typeof requestSchema>
export const requestListSchema = z.array(requestSchema)
export type RequestList = z.infer<typeof requestListSchema>
