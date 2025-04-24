// import { z } from 'zod'
// //path  : fe/src/features/students/data/schema.ts
// // Định nghĩa schema cho trạng thái học sinh
// export const studentStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
// // Định nghĩa schema cho parent (người giám hộ)
// const parentSchema = z.object({
//   userId: z.string().uuid(),
//   username: z.string(),
//   name: z.string(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
//   dob: z.coerce.date(),
//   email: z.string().email(),
//   avatar: z.string(),
//   phone: z.string(),
//   address: z.string(),
//   status: studentStatusSchema,
//   role: z.string(),
// })
// // Định nghĩa schema cho học sinh
// export const studentSchema = z.object({
//   id: z.string().uuid(),
//   rollNumber: z.string().optional(),
//   name: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }),
//   className: z.string().optional(),
//   avatar: z.string().optional(),
//   dob: z.coerce.date(),
//   address: z.string(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
//   status: studentStatusSchema,
//   parentId: z.string().uuid().optional(),
//   parent: parentSchema.nullable().optional(),
//   checkpointId: z.string().uuid().nullable().optional(),
//   // Làm cho các trường checkpoint optional vì có thể chưa có điểm đón
//   checkpointName: z.string().optional(),
//   checkpointDescription: z.string().optional(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// })
// // Schema cho form cập nhật học sinh - chỉ bao gồm các trường cần thiết
// export const studentUpdateSchema = z.object({
//   id: z.string().uuid(),
//   rollNumber: z.string().optional(),
//   name: z.string().trim().min(1, { message: 'Tên không được để trống' }).optional(),
//   className: z.string().trim().min(1, { message: 'Tên lớp không được để trống' }).optional(),
//   avatar: z.string().optional(),
//   dob: z.coerce.date().optional(),
//   address: z.string().optional(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
//   status: studentStatusSchema.optional(),
//   parentId: z
//     .string()
//     .uuid({
//       message: 'Vui lòng lựa chọn phụ huynh hợp lệ.',
//     })
//     .optional(),
//   checkpointId: z.string().uuid().nullable().optional(),
// })
// // Tạo kiểu TypeScript để tái sử dụng
// export type StudentStatus = z.infer<typeof studentStatusSchema>
// export type Parent = z.infer<typeof parentSchema>
// export type Student = z.infer<typeof studentSchema>
// export type StudentUpdate = z.infer<typeof studentUpdateSchema>
// // Danh sách học sinh là mảng Student
// export const studentListSchema = z.array(studentSchema)
import { z } from 'zod'

//path  : fe/src/features/students/data/schema.ts
// Định nghĩa schema cho trạng thái học sinh
export const studentStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

// Định nghĩa schema cho parent (người giám hộ)
const parentSchema = z.object({
  userId: z.string().uuid(),
  username: z.string().trim().min(1, { message: 'Tên đăng nhập không được để trống' }),
  name: z.string().trim().min(1, { message: 'Tên không được để trống' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.coerce.date(),
  email: z.string().trim().email({ message: 'Email không đúng định dạng' }),
  avatar: z.string(),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, { message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0' }),
  address: z.string().trim().min(1, { message: 'Địa chỉ không được để trống' }),
  status: studentStatusSchema,
  role: z.string(),
})

// Định nghĩa schema cho học sinh
export const studentSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string().optional(),
  name: z.string().trim().min(1, { message: 'Họ và tên không được để trống' }),
  className: z.string().optional(),
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

// Schema cho form cập nhật học sinh - chỉ bao gồm các trường cần thiết
export const studentUpdateSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string().trim().optional(),
  name: z.string().trim().min(1, { message: 'Tên không được để trống' }).optional(),
  className: z.string().trim().min(1, { message: 'Tên lớp không được để trống' }).optional(),
  avatar: z.string().optional(),
  dob: z.coerce.date().optional(),
  address: z.string().trim().min(1, { message: 'Địa chỉ không được để trống' }).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  status: studentStatusSchema.optional(),
  parentId: z
    .string()
    .uuid({
      message: 'Vui lòng lựa chọn phụ huynh hợp lệ.',
    })
    .optional(),
  checkpointId: z.string().uuid().nullable().optional(),
  // Add validation for phone and email if they exist in the student model
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, { message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0' })
    .optional(),
  email: z.string().trim().email({ message: 'Email không đúng định dạng' }).optional(),
})

// Tạo kiểu TypeScript để tái sử dụng
export type StudentStatus = z.infer<typeof studentStatusSchema>
export type Parent = z.infer<typeof parentSchema>
export type Student = z.infer<typeof studentSchema>
export type StudentUpdate = z.infer<typeof studentUpdateSchema>

// Danh sách học sinh là mảng Student
export const studentListSchema = z.array(studentSchema)
