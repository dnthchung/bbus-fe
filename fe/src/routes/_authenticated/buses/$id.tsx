import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/buses/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>Hello "/_authenticated/buses/{id}"!</div>
}
