// fe/src/features/users/data/data.ts
import { IconShield, IconUserShield, IconUsersGroup, IconSchool, IconUser, IconTruck } from '@tabler/icons-react'
import { UserStatus } from '@/features/users/schema'

// Map tiếng Việt cho status
export const statusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
}

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
  {
    label: 'Parent',
    labelVi: 'Phụ huynh',
    value: 'PARENT',
    icon: IconUser,
  },
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
