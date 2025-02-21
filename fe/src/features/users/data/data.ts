// Đường dẫn: fe/src/features/users/data/data.ts
import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
// Import các icon từ thư viện `@tabler/icons-react`
import { UserStatus } from './schema'

// Import kiểu `UserStatus` từ `schema.ts`
export const callTypes = new Map<UserStatus, string>([
  // <Map> trạng thái người dùng (`UserStatus`) với các class Tailwind để tạo kiểu
  [
    'active',
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200', // Màu xanh lá cây nhạt cho trạng thái "active"
  ],
  [
    'inactive',
    'bg-neutral-300/40 border-neutral-300', // Màu xám cho trạng thái "inactive"
  ],
  [
    'invited',
    'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300', // Màu xanh dương nhạt cho trạng thái "invited"
  ],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10', // Màu đỏ cảnh báo cho trạng thái "suspended"
  ],
])

// Danh sách các loại người dùng cùng với nhãn, giá trị, và icon tương ứng
export const userTypes = [
  {
    label: 'Superadmin', // Hiển thị nhãn
    value: 'superadmin', // Giá trị lưu trữ trong hệ thống
    icon: IconShield, // Icon đại diện cho vai trò "superadmin"
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield, // Icon đại diện cho vai trò "admin"
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup, // Icon đại diện cho vai trò "manager"
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: IconCash, // Icon đại diện cho vai trò "cashier"
  },
] as const // `as const` để đảm bảo danh sách này không thể bị thay đổi
