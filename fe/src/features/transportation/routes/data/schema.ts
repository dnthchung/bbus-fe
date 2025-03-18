// // Đường dẫn: fe/src/features/users/data/schema.ts
// import { z } from 'zod'
// // Import thư viện `zod` để xác thực dữ liệu
// // Định nghĩa schema cho trạng thái của người dùng
// const userStatusSchema = z.union([
//   z.literal('active'), // Người dùng đang hoạt động
//   z.literal('inactive'), // Người dùng không hoạt động
//   z.literal('invited'), // Người dùng đã được mời nhưng chưa tham gia
//   z.literal('suspended'), // Người dùng bị đình chỉ
// ])
// // Tạo kiểu TypeScript tương ứng từ schema
// export type UserStatus = z.infer<typeof userStatusSchema>
// // Định nghĩa schema cho vai trò của người dùng
// const userRoleSchema = z.union([
//   z.literal('system-admin'),
//   z.literal('business-admin'),
//   z.literal('teacher'),
//   z.literal('parent'),
//   z.literal('student'),
//   z.literal('assistant-driver'),
//   z.literal('bus-driver'),
// ])
// // Định nghĩa schema cho đối tượng người dùng
// const userSchema = z.object({
//   id: z.string(),
//   fullName: z.string(), // Thay vì firstName + lastName
//   username: z.string(),
//   email: z.string(),
//   phoneNumber: z.string(),
//   status: userStatusSchema,
//   role: userRoleSchema,
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
// })
// // Tạo kiểu TypeScript `User` từ schema
// export type User = z.infer<typeof userSchema>
// // Định nghĩa danh sách người dùng là một mảng các đối tượng User
// export const userListSchema = z.array(userSchema)
// fe/src/features/users/data/schema.ts
import { z } from 'zod'

// 1) Xác định kiểu dữ liệu cho trạng thái
//    Nếu API chỉ trả về bốn trạng thái bên dưới, bạn liệt kê chúng trong z.enum():
//    "ACTIVE" | "INACTIVE" | "INVITED" | "SUSPENDED"
// const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE']).transform((val) => val.toLowerCase() as Lowercase<typeof val>)
const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type UserStatus = z.infer<typeof userStatusSchema>
// 2) Xác định kiểu dữ liệu cho roles
//    Vì API có thể trả về mảng nhiều roles, bạn dùng z.array(...) với các vai trò có thể.
const roleEnum = z.enum(['ADMIN', 'PARENT', 'TEACHER', 'DRIVER', 'ASSISTANT', 'SYSADMIN'])

// 3) Xây dựng schema chính cho 1 user
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  // Nếu "gender" chỉ có 2 giá trị "MALE" / "FEMALE", dùng z.enum().
  // Hoặc nếu có thể null/undefined, bạn có thể thêm .optional() hoặc union(...).
  gender: z.enum(['MALE', 'FEMALE']).optional(),

  // Nếu bạn muốn parse "dob" thành Date trong FE, dùng z.coerce.date().
  // Còn nếu muốn giữ nguyên kiểu string, chỉ cần z.string() thôi.
  dob: z.coerce.date(),

  email: z.string().email(),
  avatar: z.string().optional(),
  phone: z.string(),
  address: z.string(),
  status: userStatusSchema,

  // roles là mảng (ví dụ ["TEACHER"]), nên ta dùng z.array(roleEnum).
  roles: z.array(roleEnum),
})

// Tạo type User từ schema
export type User = z.infer<typeof userSchema>

// Tạo schema cho danh sách user
export const userListSchema = z.array(userSchema)
