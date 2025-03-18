import { createLazyFileRoute } from '@tanstack/react-router'
import Schedules from '@/features/transportation/schedules'

export const Route = createLazyFileRoute('/_authenticated/transportation/schedules')({
  component: Schedules,
})
