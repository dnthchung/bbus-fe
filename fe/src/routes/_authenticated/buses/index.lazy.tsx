import { createLazyFileRoute } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/buses/')({
  component: () => <Navigate to="/buses/list" />,
  errorComponent: () => <div>Something went wrong</div>,
})
