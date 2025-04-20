import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/transportation/routes/list/details/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/transportation/list/$id"!</div>
}
