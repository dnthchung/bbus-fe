import { createFileRoute } from '@tanstack/react-router'
import Routes from '@/features/transportation/routes'

export const Route = createFileRoute('/_authenticated/transportation/routes')({
  component: Routes,
})
