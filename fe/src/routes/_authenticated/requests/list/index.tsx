import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import RequestContent from '@/features/requests/list'

export const Route = createFileRoute('/_authenticated/requests/list/')({
  component: withRoleRoute(RequestContent, ['ADMIN']),
})
