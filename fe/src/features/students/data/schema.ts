//path : fe/src/features/students/data/schema.ts
import { z } from 'zod'

// Import thư viện Zod để xác thực dữ liệu

// Định nghĩa schema cho trạng thái sử dụng dịch vụ xe buýt
const busServiceStatusSchema = z.union([
  z.literal('Đang sử dụng'), // Học sinh đang sử dụng dịch vụ xe buýt
  z.literal('Tạm ngừng sử dụng'), // Học sinh tạm ngừng sử dụng dịch vụ
])

export type BusServiceStatus = z.infer<typeof busServiceStatusSchema>

//Định nghĩa schema cho học sinh (chỉ học sinh đã đăng ký xe buýt)
// export const studentSchema = z.object({
//   studentId: z.string().uuid().optional(), // Với add mới có thể để optional
//   avatar: z.string().url(),
//   fullName: z.string(),
//   birthDate: z.coerce.date(), // Ép kiểu string → date
//   grade: z.number().int().min(1).max(9),
//   class: z.string().regex(/^[1-9][A-J]$/, {
//     message: "Class must match e.g. '1A', '2B', ... '9J'",
//   }),
//   busServiceStatus: busServiceStatusSchema,
// })

export const studentSchema = z
  .object({
    studentId: z.string().uuid().optional(),
    avatar: z.string().url(),
    fullName: z.string(),
    birthDate: z.coerce.date(),
    // Khối (1..9)
    grade: z.number().int().min(1).max(9),
    // class: Ví dụ "3B", "9J"… theo regex
    class: z.string().regex(/^[1-9][A-J]$/, {
      message: "Class must be like '1A', '2B', ... '9J'",
    }),
    busServiceStatus: busServiceStatusSchema,
  })
  // Thêm superRefine để kiểm tra match giữa grade và class
  .superRefine(({ grade, class: classValue }, ctx) => {
    // Ví dụ: classValue = "3B" => parseInt("3",10) = 3
    const gradeFromClass = parseInt(classValue[0], 10)
    if (gradeFromClass !== grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['class'],
        message: `Class '${classValue}' doesn't match grade ${grade}.`,
      })
    }
  })

// Tạo kiểu TypeScript `Student` từ schema
export type Student = z.infer<typeof studentSchema>

// Định nghĩa danh sách học sinh là một mảng các đối tượng Student
export const studentListSchema = z.array(studentSchema)
