// fe/src/features/users/data/data.ts
import { IconShield, IconUserShield, IconUsersGroup, IconSchool, IconUser, IconId, IconTruck } from '@tabler/icons-react'
import { UserStatus } from './schema'

// Map user status with Tailwind classes
export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  ['suspended', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

// User roles with corresponding labels (English for logic, Vietnamese for UI)
export const userTypes = [
  {
    label: 'System Admin',
    labelVi: 'Quản trị hệ thống',
    value: 'system-admin',
    icon: IconShield,
  },
  {
    label: 'Business Admin',
    labelVi: 'Quản trị doanh nghiệp',
    value: 'business-admin',
    icon: IconUserShield,
  },
  {
    label: 'Teacher',
    labelVi: 'Giáo viên',
    value: 'teacher',
    icon: IconSchool,
  },
  { label: 'Parent', labelVi: 'Phụ huynh', value: 'parent', icon: IconUser },
  { label: 'Student', labelVi: 'Học sinh', value: 'student', icon: IconId },
  {
    label: 'Assistant Driver',
    labelVi: 'Phụ tá tài xế',
    value: 'assistant-driver',
    icon: IconUsersGroup,
  },
  {
    label: 'Bus Driver',
    labelVi: 'Tài xế xe buýt',
    value: 'bus-driver',
    icon: IconTruck,
  },
] as const
