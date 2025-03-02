import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/transportation/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/transportation/"!</div>
}
