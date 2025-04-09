import { createLazyFileRoute } from '@tanstack/react-router'
import Students from '@/features/students'
import { withRoleRoute } from '@/guards/with-role-route'

export const Route = createLazyFileRoute('/_authenticated/students/')({
  component: withRoleRoute(Students, ['ADMIN']),
})
