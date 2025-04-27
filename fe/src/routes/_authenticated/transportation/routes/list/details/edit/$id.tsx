import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import EditRouteManagement from '@/features/transportation/routes/components/page/routes-edit-page'

export const Route = createFileRoute('/_authenticated/transportation/routes/list/details/edit/$id')({
  component: withRoleRoute(EditRouteManagement, ['ADMIN']),
})
