import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/requests/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/requests/"!</div>
}
