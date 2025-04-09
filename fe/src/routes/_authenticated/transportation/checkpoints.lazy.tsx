import { createLazyFileRoute } from '@tanstack/react-router'
import Checkpoints from '@/features/transportation/checkpoints'
import { withRoleRoute } from '@/guards/with-role-route'

export const Route = createLazyFileRoute('/_authenticated/transportation/checkpoints')({
  component: withRoleRoute(Checkpoints, ['ADMIN']),
})
