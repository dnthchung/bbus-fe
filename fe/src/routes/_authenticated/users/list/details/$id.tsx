import { createFileRoute } from '@tanstack/react-router'
import { withRoleRoute } from '@/guards/with-role-route'
import { API_SERVICES } from '@/api/api-services'
import UsersDetailsContent from '@/features/users/components/page/users-view-edit-details'
import { getUserById } from '@/features/users/users'

export const Route = createFileRoute('/_authenticated/users/list/details/$id')({
  component: withRoleRoute(UsersDetailsContent, ['ADMIN']),
  // loader: async ({ params }) => {
  //   console.log('params', params)
  //   const user = await getUserById(params.id)
  //   return user
  // },
})
