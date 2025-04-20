import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import RouteManagement from '@/features/transportation/routes/list'

export const Route = createFileRoute(
  '/_authenticated/transportation/routes/list/',
)({
  component: withRoleRoute(RouteManagement, ['ADMIN']),
})
