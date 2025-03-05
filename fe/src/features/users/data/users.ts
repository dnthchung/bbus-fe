//path : fe/src/features/users/data/users.ts
// Import thư viện faker để tạo dữ liệu giả mạo
import { faker } from '@faker-js/faker'

// Tạo một mảng gồm 20 người dùng giả mạo
export const users = Array.from({ length: 20 }, () => {
  const fullName = faker.person.fullName()

  return {
    id: faker.string.uuid(),
    fullName, // Tên đầy đủ
    username: faker.internet
      .userName() // Hoặc .username({ firstName, lastName }) tuỳ bạn
      .toLocaleLowerCase(),
    email: faker.internet.email().toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement(['active', 'inactive', 'invited', 'suspended']),
    role: faker.helpers.arrayElement(['system-admin', 'business-admin', 'teacher', 'parent', 'student', 'assistant-driver', 'bus-driver']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
