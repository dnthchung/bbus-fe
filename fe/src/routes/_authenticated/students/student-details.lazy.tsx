import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/students/student-details',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/students/student-details"!</div>
}
