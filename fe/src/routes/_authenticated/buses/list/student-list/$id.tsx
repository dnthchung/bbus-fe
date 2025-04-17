import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import PageViewStudentListDetails from '@/features/buses/list/components/page/page-view-student-list'

export const Route = createFileRoute('/_authenticated/buses/list/student-list/$id')({
  component: withRoleRoute(PageViewStudentListDetails, ['ADMIN']),
})
