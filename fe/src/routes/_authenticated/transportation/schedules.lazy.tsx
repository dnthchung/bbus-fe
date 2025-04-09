import { createLazyFileRoute } from '@tanstack/react-router'
import Schedules from '@/features/transportation/schedules'
import { withRoleRoute } from '@/guards/with-role-route'

export const Route = createLazyFileRoute('/_authenticated/transportation/schedules')({
  component:  withRoleRoute(Schedules, ['ADMIN']),
})
