// //path : fe/src/features/users/data/users.ts
// // Import thư viện faker để tạo dữ liệu giả mạo
// import { faker } from '@faker-js/faker'
// // Tạo một mảng gồm 20 người dùng giả mạo
// export const users = Array.from({ length: 20 }, () => {
//   const fullName = faker.person.fullName()
//   return {
//     id: faker.string.uuid(),
//     fullName, // Tên đầy đủ
//     username: faker.internet
//       .userName() // Hoặc .username({ firstName, lastName }) tuỳ bạn
//       .toLocaleLowerCase(),
//     email: faker.internet.email().toLocaleLowerCase(),
//     phoneNumber: faker.phone.number({ style: 'international' }),
//     status: faker.helpers.arrayElement(['active', 'inactive', 'invited', 'suspended']),
//     role: faker.helpers.arrayElement(['system-admin', 'business-admin', 'teacher', 'parent', 'student', 'assistant-driver', 'bus-driver']),
//     createdAt: faker.date.past(),
//     updatedAt: faker.date.recent(),
//   }
// })
// fe/src/features/users/data/users.ts
import { API_SERVICES } from '@/api/api-services'
import { userListSchema, User } from './schema'

// hoặc đường dẫn tới file khai báo axios

/**
 * Gọi API lấy danh sách user, parse bằng Zod, trả về mảng User.
 */
// export async function getAllUsers(page = 1, size = 20): Promise<User[]> {
export async function getAllUsers(): Promise<User[]> {
  try {
    // Gọi API (đã được cấu hình token interceptor)
    // Ví dụ, nếu API_SERVICES.users.list(page, size) => "/user/list?page=...&size=..."
    const response = await API_SERVICES.users.list()

    // Phản hồi của Axios thường nằm ở response.data
    // Ví dụ: response.data = { status: 200, message: "user list", data: {...} }
    const rawData = response.data
    console.log('rawData', rawData)
    // Mảng user có thể ở rawData.data.users
    const rawUsers = rawData?.data?.users
    console.log('rawUsers', rawUsers)
    if (!rawUsers) {
      // Nếu không có dữ liệu users, trả về mảng rỗng
      return []
    }

    // Parse & validate với Zod
    const parsedUsers = userListSchema.parse(rawUsers)
    return parsedUsers
  } catch (error) {
    console.error('Error getAllUsers in users.ts:', error)
    // Nếu lỗi, có thể return [] hoặc throw tùy bạn
    throw error
  }
}
