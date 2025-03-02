import { createLazyFileRoute } from '@tanstack/react-router'
import Students from '@/features/students'

export const Route = createLazyFileRoute('/_authenticated/students/')({
  component: Students,
})
