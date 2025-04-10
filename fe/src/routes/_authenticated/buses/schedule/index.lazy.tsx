import { createLazyFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import Schedule from '@/features/buses/schedule'

export const Route = createLazyFileRoute('/_authenticated/buses/schedule/')({
  component: withRoleRoute(Schedule, ['ADMIN']),
})
