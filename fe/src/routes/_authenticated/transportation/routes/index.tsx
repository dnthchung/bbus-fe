import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transportation/routes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/transportation/routes/"!</div>
}
