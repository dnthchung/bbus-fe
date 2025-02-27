import { z } from 'zod'

// Import thư viện Zod để xác thực dữ liệu

// Định nghĩa schema cho trạng thái sử dụng dịch vụ xe buýt
const busServiceStatusSchema = z.union([
  z.literal('Đang sử dụng'), // Học sinh đang sử dụng dịch vụ xe buýt
  z.literal('Tạm ngừng sử dụng'), // Học sinh tạm ngừng sử dụng dịch vụ
])

export type BusServiceStatus = z.infer<typeof busServiceStatusSchema>

// Định nghĩa schema cho học sinh (chỉ học sinh đã đăng ký xe buýt)
export const studentSchema = z.object({
  studentId: z.string().uuid(), // Mã học sinh (UUID)
  avatar: z.string().url(), // URL ảnh thẻ học sinh
  fullName: z.string(), // Họ và tên đầy đủ
  birthDate: z.coerce.date(), // Ngày sinh (ép kiểu từ string thành Date)
  grade: z.number().int().min(1).max(9), // Khối từ 1 đến 9
  class: z.string().regex(/^[1-9][A-J]$/), // Lớp (ví dụ: "1A", "5D", "9J")
  busServiceStatus: busServiceStatusSchema, // Trạng thái xe buýt
})

// Tạo kiểu TypeScript `Student` từ schema
export type Student = z.infer<typeof studentSchema>

// Định nghĩa danh sách học sinh là một mảng các đối tượng Student
export const studentListSchema = z.array(studentSchema)
