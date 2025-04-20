//url file : /_authenticated/students/attendance.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import Attendance from '@/features/students/attendance'

export const Route = createLazyFileRoute('/_authenticated/students/attendance')({
  component: withRoleRoute(Attendance, ['ADMIN']),
})
