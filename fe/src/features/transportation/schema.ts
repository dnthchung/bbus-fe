// { "tbl_checkpoint": [ { "created_at": "", "updated_at": "", "id": "", "description": "", "latitude": "", "longitude": "", "name": "", "status": "" } ] } đây là table tyorng db : insert into public.tbl_checkpoint (created_at, updated_at, id, description, latitude, longitude, name, status) values  ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '987ac0dd-4864-4f09-a165-caa41f52ec71', 'Điểm đón xe buýt gần Bến xe Mỹ Đình', '21.033781', '105.782362', 'Bến xe Mỹ Đình', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '8cd00406-9545-49b7-b40b-4d2bba9446f2', 'Điểm dừng trước cổng Đại học Quốc gia', '21.037263', '105.783713', 'Đại học Quốc gia', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '9018c45f-6cf2-48d5-a500-85a86ede3b2f', 'Điểm bắt xe tại cổng Đại học Bách Khoa', '21.004500', '105.843888', 'Đại học Bách Khoa', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '90cd0ab6-9bc0-42be-a996-6f47cfe2b04c', 'Trạm xe buýt đối diện Hồ Hoàn Kiếm', '21.028511', '105.854203', 'Hồ Hoàn Kiếm', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '40c64531-8e7a-4294-9e48-e41f02f57e3b', 'Điểm dừng xe gần Công viên Thống Nhất', '21.017111', '105.847450', 'Công viên Thống Nhất', 'INACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '9c7dc267-6dc8-49b5-9f4c-1ba317cc516d', 'Trạm xe buýt ngay Bến xe Giáp Bát', '20.995568', '105.841293', 'Bến xe Giáp Bát', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '882f1ff1-4013-4d0c-9608-acc007354e82', 'Điểm đón xe trước cổng Royal City', '21.003653', '105.815528', 'Royal City', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '90fc9498-d6c2-4fa4-9f48-266fbf8f1ebf', 'Điểm dừng xe tại Vincom Nguyễn Chí Thanh', '21.023300', '105.805900', 'Vincom Nguyễn Chí Thanh', 'ACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', '346b48c3-912f-456f-b2e2-4469260962e6', 'Trạm xe buýt ở đầu cầu Chương Dương', '21.033028', '105.863672', 'Cầu Chương Dương', 'INACTIVE'), ('2025-03-06 15:17:17.012687', '2025-03-06 15:17:17.012687', 'd13b413f-508a-406a-9fd1-6f581fd73e58', 'Điểm bắt xe buýt gần sân vận động Mỹ Đình', '21.026874', '105.762417', 'Sân vận động Mỹ Đình', 'ACTIVE');
//path : fe/src/features/transportation/checkpoints/data/schema.tsx
import { z } from 'zod'

// Định nghĩa schema cho trạng thái của điểm dừng xe buýt (ACTIVE/INACTIVE)
const checkpointStatusSchema = z.union([
  z.literal('ACTIVE'), // Điểm dừng xe buýt đang hoạt động
  z.literal('INACTIVE'), // Điểm dừng xe buýt không hoạt động
])

// Định nghĩa schema cho một điểm dừng xe buýt (Checkpoint)
export const checkpointSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  latitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, { message: 'Latitude must be a valid coordinate' }),
  longitude: z.string().regex(/^[-+]?[0-9]*\.?[0-9]+$/, { message: 'Longitude must be a valid coordinate' }),
  status: checkpointStatusSchema,
})

export type Checkpoint = z.infer<typeof checkpointSchema>
export type CheckpointStatus = z.infer<typeof checkpointStatusSchema>
export const checkpointListSchema = z.array(checkpointSchema)
//========================================================================
// Define schema for route
export const routeSchema = z.object({
  id: z.string().uuid(), // UUID of the route
  code: z.string(), // Route code (e.g., R001)
  description: z.string(), // Description of the route
  path: z.string(), // Path as space-separated checkpoint IDs
  periodStart: z.string(), // Start date of the route period
  periodEnd: z.string(), // End date of the route period
})

// Export types
export type Route = z.infer<typeof routeSchema>
