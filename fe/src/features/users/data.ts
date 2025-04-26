// fe/src/features/users/data/data.ts
import { IconShield, IconUserShield, IconUsersGroup, IconSchool, IconUser, IconTruck } from '@tabler/icons-react'
import { UserStatus } from '@/features/users/schema'

// Map tiếng Việt cho status
export const statusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Không hoạt động',
}
// User roles with corresponding labels (English for logic, Vietnamese for UI)
//với ADMIN => lấy toàn bộ user TRỪ các tài khoản có role là ADMIN và SYSADMIN
//với SYSADMIN => lấy toàn bộ user CÓ role là ADMIN và SYSADMIN
export const userTypes = [
  {
    label: 'System Admin',
    labelVi: 'Quản trị hệ thống',
    value: 'SYSADMIN',
    icon: IconShield,
  },
  {
    label: 'Business Admin',
    labelVi: 'Quản lý',
    value: 'ADMIN',
    icon: IconUserShield,
  },
  // {
  //   label: 'Teacher',
  //   labelVi: 'Giáo viên',
  //   value: 'TEACHER',
  //   icon: IconSchool,
  // },
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

export const allAdminUsersTypes = [
  {
    label: 'System Admin',
    labelVi: 'Quản trị hệ thống',
    value: 'SYSADMIN',
    icon: IconShield,
  },
  {
    label: 'Business Admin',
    labelVi: 'Quản lý',
    value: 'ADMIN',
  },
] as const

export const allUsersExceptAdminsTypes = [
  // {
  //   label: 'Teacher',
  //   labelVi: 'Giáo viên',
  //   value: 'TEACHER',
  //   icon: IconSchool,
  // },
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
