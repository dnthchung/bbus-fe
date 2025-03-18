import { createLazyFileRoute } from '@tanstack/react-router'

// import Users from '@/features/users'

export const Route = createLazyFileRoute('/_authenticated/buses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/buses/"!</div>
}
