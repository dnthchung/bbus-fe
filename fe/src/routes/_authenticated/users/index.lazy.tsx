//path : src/routes/_authenticated/users/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: withRoleRoute(Users, ['SYSADMIN']),
})
