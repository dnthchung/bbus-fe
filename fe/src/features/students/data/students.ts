//path : fe/src/features/students/data/students.ts
import { faker } from '@faker-js/faker'

export const students = Array.from({ length: 20 }, () => {
  const fullName = faker.person.fullName()
  const grade = faker.number.int({ min: 1, max: 9 }) // Khối từ 1 đến 9
  const classSuffix = faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) // Lớp từ A đến J

  return {
    studentId: faker.string.uuid(), // Mã học sinh (UUID)
    avatar: faker.image.urlPicsumPhotos({ width: 200, height: 200 }), // Ảnh thẻ học sinh (200x200)
    fullName, // Họ và tên đầy đủ
    birthDate: faker.date.birthdate({ min: 6, max: 15, mode: 'age' }), // Ngày sinh (6-15 tuổi, phù hợp cấp tiểu học + THCS)
    grade, // Khối học (1-9)
    class: `${grade}${classSuffix}`, // Lớp cụ thể (Ví dụ: 1A, 2B, ..., 9J)
    busServiceStatus: faker.helpers.arrayElement(['Đang sử dụng', 'Tạm ngừng sử dụng']), // Trạng thái dịch vụ xe buýt
  }
})

console.log(students)
