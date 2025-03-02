//path : fe/src/features/students/data/data.ts
import { IconSchool, IconId } from '@tabler/icons-react'
import { BusServiceStatus } from './schema'

// Map trạng thái xe buýt với Tailwind classes
export const busServiceStatuses = new Map<BusServiceStatus, string>([
  ['Đang sử dụng', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
  ['Tạm ngừng sử dụng', 'bg-yellow-200/40 text-yellow-900 dark:text-yellow-100 border-yellow-300'],
])

// Các loại học sinh với nhãn tiếng Việt cho UI
export const studentTypes = [
  {
    label: 'Primary Student',
    labelVi: 'Học sinh tiểu học',
    value: 'primary-student',
    icon: IconSchool,
  },
  {
    label: 'Secondary Student',
    labelVi: 'Học sinh trung học cơ sở',
    value: 'secondary-student',
    icon: IconId,
  },
] as const
