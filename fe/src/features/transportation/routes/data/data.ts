// fe/src/features/users/data/data.ts
import { IconShield, IconUserShield, IconUsersGroup, IconSchool, IconUser, IconTruck } from '@tabler/icons-react'
import { UserStatus } from './schema'

// Map user status with Tailwind classes
export const callTypes = new Map<UserStatus, string>([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVE', 'bg-neutral-300/40 border-neutral-300'],
])

// User roles with corresponding labels (English for logic, Vietnamese for UI)
export const userTypes = [
  {
    label: 'System Admin',
    labelVi: 'Quản trị hệ thống',
    value: 'SYSADMIN',
    icon: IconShield,
  },
  {
    label: 'Business Admin',
    labelVi: 'Quản trị doanh nghiệp',
    value: 'ADMIN',
    icon: IconUserShield,
  },
  {
    label: 'Teacher',
    labelVi: 'Giáo viên',
    value: 'TEACHER',
    icon: IconSchool,
  },
  { label: 'Parent', labelVi: 'Phụ huynh', value: 'PARENT', icon: IconUser },
  {
    label: 'Assistant Driver',
    labelVi: 'Phụ tá tài xế',
    value: 'ASSISTANT',
    icon: IconUsersGroup,
  },
  {
    label: 'Bus Driver',
    labelVi: 'Tài xế xe buýt',
    value: 'DRIVER',
    icon: IconTruck,
  },
] as const
