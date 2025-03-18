// //path : fe/src/features/students/data/schema.ts
// import { z } from 'zod'
// // Định nghĩa schema cho trạng thái học sinh
// const studentStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
// // Định nghĩa schema cho học sinh
// export const studentSchema = z.object({
//   id: z.string().uuid(),
//   rollNumber: z.string(),
//   name: z.string(),
//   avatar: z.string().url(),
//   dob: z.coerce.date(),
//   address: z.string(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
//   status: studentStatusSchema,
//   parentId: z.string().uuid(),
//   parentName: z.string(),
//   parentPhone: z.string(),
//   checkpointId: z.string().uuid(),
//   checkpointName: z.string(),
//   checkpointDescription: z.string(),
// })
// // Định nghĩa schema cho trạng thái học sinh
// export type StudentStatus = z.infer<typeof studentStatusSchema>
// // Tạo kiểu TypeScript `Student` từ schema
// export type Student = z.infer<typeof studentSchema>
// // Định nghĩa danh sách học sinh là một mảng các đối tượng Student
// export const studentListSchema = z.array(studentSchema)
// ======================================================================
// fe/src/features/students/data/schema.ts
import { z } from 'zod'

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
  // Nếu biết chắc chỉ có giá trị "PARENT", ta có thể dùng z.literal("PARENT").
  // Trường hợp tương lai có nhiều role khác, có thể để z.string() hoặc z.enum([...])
  role: z.string(),
})

// Định nghĩa schema cho học sinh
export const studentSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string(),
  name: z.string(),
  avatar: z.string(),
  dob: z.coerce.date(),
  address: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  status: studentStatusSchema,

  // API trả về parentId và kèm "parent" là object đầy đủ
  parentId: z.string().uuid(),
  parent: parentSchema.nullable().optional(),

  // API có trường hợp checkpointId = null
  checkpointId: z.string().uuid().nullable(),
  checkpointName: z.string(),
  checkpointDescription: z.string(),
})

// Tạo kiểu TypeScript để tái sử dụng
export type StudentStatus = z.infer<typeof studentStatusSchema>
export type Parent = z.infer<typeof parentSchema>
export type Student = z.infer<typeof studentSchema>

// Danh sách học sinh là mảng Student
export const studentListSchema = z.array(studentSchema)
