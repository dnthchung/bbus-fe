import { createFileRoute } from '@tanstack/react-router'
import Routes from '@/features/transportation/routes'
import { withRoleRoute } from '@/guards/with-role-route'

export const Route = createFileRoute('/_authenticated/transportation/routes')({
  component: withRoleRoute(Routes, ['ADMIN']),
})
