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
  z.literal('superadmin'), // Quyền cao nhất, quản lý toàn bộ hệ thống
  z.literal('admin'), // Quản trị viên có quyền quản lý chung
  z.literal('cashier'), // Nhân viên thu ngân
  z.literal('manager'), // Quản lý cấp trung
])

// Định nghĩa schema cho đối tượng người dùng
const userSchema = z.object({
  id: z.string(), // ID của người dùng (kiểu string)
  firstName: z.string(), // Tên của người dùng
  lastName: z.string(), // Họ của người dùng
  username: z.string(), // Tên đăng nhập
  email: z.string(), // Địa chỉ email
  phoneNumber: z.string(), // Số điện thoại
  status: userStatusSchema, // Trạng thái người dùng (đã định nghĩa bên trên)
  role: userRoleSchema, // Vai trò người dùng (đã định nghĩa bên trên)
  createdAt: z.coerce.date(), // Ngày tạo tài khoản (chuyển đổi sang kiểu Date)
  updatedAt: z.coerce.date(), // Ngày cập nhật tài khoản (chuyển đổi sang kiểu Date)
})

// Tạo kiểu TypeScript `User` từ schema
export type User = z.infer<typeof userSchema>

// Định nghĩa danh sách người dùng là một mảng các đối tượng User
export const userListSchema = z.array(userSchema)
