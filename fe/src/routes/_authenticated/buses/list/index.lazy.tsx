import { createLazyFileRoute } from '@tanstack/react-router'
import BusList from '@/features/buses/list'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createLazyFileRoute('/_authenticated/buses/list/')({
  component: withRoleRoute(BusList, ['ADMIN']),
})
