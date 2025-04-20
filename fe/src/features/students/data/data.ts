//path : fe/src/features/students/data/data.ts
import { StudentStatus } from '@/features/students/data/schema'

// Map trạng thái học sinh với Tailwind classes
export const studentStatusClasses = new Map<StudentStatus, string>([
  ['ACTIVE', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
  ['INACTIVE', 'bg-red-200/40 text-red-900 dark:text-red-100 border-red-300'],
])

// Map tiếng Việt cho trạng thái học sinh
export const statusLabels: Record<StudentStatus, string> = {
  ACTIVE: 'Đang sử dụng',
  INACTIVE: 'Dừng sử dụng',
}

// Map giới tính
export const genderLabels = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
}
