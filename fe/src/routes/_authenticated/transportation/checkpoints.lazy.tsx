import { createLazyFileRoute } from '@tanstack/react-router'
import Checkpoints from '@/features/transportation/checkpoints'

export const Route = createLazyFileRoute('/_authenticated/transportation/checkpoints')({
  component: Checkpoints,
})
