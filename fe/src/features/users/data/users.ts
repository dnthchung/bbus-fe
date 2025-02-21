//path : fe/src/features/users/data/users.ts
// Import thư viện faker để tạo dữ liệu giả mạo
import { faker } from '@faker-js/faker'

// Tạo một mảng gồm 20 người dùng giả mạo
export const users = Array.from({ length: 20 }, () => {
  // Tạo tên và họ ngẫu nhiên
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(), // Tạo UUID duy nhất cho mỗi người dùng
    firstName, // Gán tên đầu tiên ngẫu nhiên
    lastName, // Gán họ ngẫu nhiên
    username: faker.internet
      .username({ firstName, lastName }) // Tạo username dựa trên tên
      .toLocaleLowerCase(), // Chuyển về chữ thường để nhất quán

    email: faker.internet.email({ firstName }).toLocaleLowerCase(), // Tạo email dựa trên tên đầu tiên và chuyển về chữ thường

    phoneNumber: faker.phone.number({ style: 'international' }), // Tạo số điện thoại theo định dạng quốc tế

    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ]), // Chọn ngẫu nhiên một trạng thái từ danh sách có sẵn

    role: faker.helpers.arrayElement([
      'superadmin',
      'admin',
      'cashier',
      'manager',
    ]), // Chọn ngẫu nhiên một vai trò từ danh sách có sẵn

    createdAt: faker.date.past(), // Tạo ngày tạo tài khoản trong quá khứ
    updatedAt: faker.date.recent(), // Tạo ngày cập nhật gần đây
  }
})
