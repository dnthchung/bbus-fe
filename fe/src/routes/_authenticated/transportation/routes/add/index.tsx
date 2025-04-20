import { createFileRoute } from '@tanstack/react-router'
import PageCreateRouteContent from '@/features/transportation/routes/components/page/page-create-route'

export const Route = createFileRoute('/_authenticated/transportation/routes/add/')({
  component: PageCreateRouteContent,
})
