// import { createFileRoute } from '@tanstack/react-router'
// import PageViewDetails from '@/features/buses/list/components/page/page-view-details'
// export const Route = createFileRoute('/_authenticated/buses/list/$id')({
//   component: PageViewDetails,
// })
import { createFileRoute } from '@tanstack/react-router'

// import PageViewDetails from '@/features/buses/list/components/page/page-view-details'

export const Route = createFileRoute('/_authenticated/buses/list/$id')({
  component: PageViewDetails,
})

function PageViewDetails() {
  const { id } = Route.useParams()
  return <div>Hello "/_authenticated/buses/list/{id}"!</div>
}
