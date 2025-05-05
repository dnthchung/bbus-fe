import { createFileRoute } from '@tanstack/react-router'
import Term from '@/features/term'

export const Route = createFileRoute('/(auth)/term/')({
  component: Term,
})
