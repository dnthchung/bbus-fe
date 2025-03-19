import { createLazyFileRoute } from '@tanstack/react-router'
import Attendance from '@/features/students/attendance'

export const Route = createLazyFileRoute('/_authenticated/students/attendance')({
  component: Attendance,
})
