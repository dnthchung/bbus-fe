import { createLazyFileRoute } from '@tanstack/react-router'
import BusList from '@/features/buses/list'

export const Route = createLazyFileRoute('/_authenticated/buses/list')({
  component: BusList,
})
