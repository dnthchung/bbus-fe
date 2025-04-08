// import { createFileRoute } from '@tanstack/react-router'
// import PageViewDetails from '@/features/buses/list/components/page/page-view-details'
// export const Route = createFileRoute('/_authenticated/buses/list/$id')({
//   component: PageViewDetails,
// })
import { createFileRoute } from '@tanstack/react-router'
import PageViewDetails from '@/features/buses/list/components/page/page-view-details'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createFileRoute('/_authenticated/buses/list/$id')({
  component: withRoleRoute(PageViewDetails, ['ADMIN']),
})

// import { getUserById } from '@/features/users/data/users'

// export const Route = createFileRoute('/_authenticated/buses/list/$id')({
//   component: PageViewDetails,
//   loader: async ({ params }) => {
//     console.log('params', params)
//     const user = await getUserById(params.id)
//     return user
//   },
// })

// function PageViewDetails() {
//   const { id } = Route.useParams()
//   const user = Route.useLoaderData()
//   console.log('user', user)
//   return <div>Hello "/_authenticated/buses/list/{id}"!</div>
// }

//có thể call api ở đây  để lấy data thông qua http get method- dùng loader
