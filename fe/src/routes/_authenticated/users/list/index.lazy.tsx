import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/users/list/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/users/list/"!</div>
}
