import { createLazyFileRoute } from '@tanstack/react-router'
import Attendance from '@/features/students/attendance'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createLazyFileRoute('/_authenticated/students/attendance')({
  component: withRoleRoute(Attendance, ['ADMIN']),
})
