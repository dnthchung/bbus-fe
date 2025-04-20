//path : src/routes/_authenticated/students/details/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import StudentsDetailsContent from '@/features/students/components/page/students-edit-view-page'
import { getStudentById } from '@/features/students/data/students'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createFileRoute('/_authenticated/students/details/$id')({
  component: withRoleRoute(StudentsDetailsContent, ['ADMIN']),
  loader: async ({ params }) => {
    console.log('params', params)
    const student = await getStudentById(params.id)
    return student
  },
})

// function RouteComponent() {
//   return <div>Hello "/_authenticated/users/details/$id"!</div>
// }

// import { getUserById } from '@/features/users/data/users'

// export const Route = createFileRoute('/_authenticated/students/details/$id')({
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
