//path : src/routes/_authenticated/users/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: Users,
})
