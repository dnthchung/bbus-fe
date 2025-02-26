// Đường dẫn: fe/src/features/users/data/schema.ts
import { z } from 'zod'

// Import thư viện `zod` để xác thực dữ liệu

// Định nghĩa schema cho trạng thái của người dùng
const userStatusSchema = z.union([
  z.literal('active'), // Người dùng đang hoạt động
  z.literal('inactive'), // Người dùng không hoạt động
  z.literal('invited'), // Người dùng đã được mời nhưng chưa tham gia
  z.literal('suspended'), // Người dùng bị đình chỉ
])

// Tạo kiểu TypeScript tương ứng từ schema
export type UserStatus = z.infer<typeof userStatusSchema>

// Định nghĩa schema cho vai trò của người dùng
const userRoleSchema = z.union([
  z.literal('system-admin'),
  z.literal('business-admin'),
  z.literal('teacher'),
  z.literal('parent'),
  z.literal('student'),
  z.literal('assistant-driver'),
  z.literal('bus-driver'),
])

// Định nghĩa schema cho đối tượng người dùng
const userSchema = z.object({
  id: z.string(),
  fullName: z.string(), // Thay vì firstName + lastName
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

// Tạo kiểu TypeScript `User` từ schema
export type User = z.infer<typeof userSchema>

// Định nghĩa danh sách người dùng là một mảng các đối tượng User
export const userListSchema = z.array(userSchema)
