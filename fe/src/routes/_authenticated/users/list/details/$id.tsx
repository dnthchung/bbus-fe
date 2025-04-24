import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import UsersDetailsContent from '@/features/users/components/page/users-view-edit-details'

export const Route = createFileRoute('/_authenticated/users/list/details/$id')({
  component: withRoleRoute(UsersDetailsContent, ['ADMIN', 'SYSADMIN']),
  // loader: async ({ params }) => {
  //   console.log('params', params)
  //   const user = await getUserById(params.id)
  //   return user
  // },
})
