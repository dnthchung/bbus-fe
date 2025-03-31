import { z } from 'zod'

//path  : fe/src/features/students/data/schema.ts
// Định nghĩa schema cho trạng thái học sinh
export const studentStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

// Định nghĩa schema cho parent (người giám hộ)
const parentSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  name: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.coerce.date(),
  email: z.string().email(),
  avatar: z.string(),
  phone: z.string(),
  address: z.string(),
  status: studentStatusSchema,
  role: z.string(),
})

// Định nghĩa schema cho học sinh
export const studentSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  dob: z.coerce.date(),
  address: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  status: studentStatusSchema,

  parentId: z.string().uuid().optional(),
  parent: parentSchema.nullable().optional(),

  checkpointId: z.string().uuid().nullable().optional(),
  // Làm cho các trường checkpoint optional vì có thể chưa có điểm đón
  checkpointName: z.string().optional(),
  checkpointDescription: z.string().optional(),
})

// Schema cho form cập nhật học sinh - chỉ bao gồm các trường cần thiết
export const studentUpdateSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string().optional(),
  name: z.string().trim().min(1, { message: 'Tên không được để trống' }).optional(),
  avatar: z.string().optional(),
  dob: z.coerce.date().optional(),
  address: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  status: studentStatusSchema.optional(),
  parentId: z
    .string()
    .uuid({
      message: 'Vui lòng lựa chọn phụ huynh hợp lệ.',
    })
    .optional(),
  checkpointId: z.string().uuid().nullable().optional(),
})

// Tạo kiểu TypeScript để tái sử dụng
export type StudentStatus = z.infer<typeof studentStatusSchema>
export type Parent = z.infer<typeof parentSchema>
export type Student = z.infer<typeof studentSchema>
export type StudentUpdate = z.infer<typeof studentUpdateSchema>

// Danh sách học sinh là mảng Student
export const studentListSchema = z.array(studentSchema)
