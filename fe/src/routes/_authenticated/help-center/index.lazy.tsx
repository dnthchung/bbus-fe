import { createLazyFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/common/coming-soon'

export const Route = createLazyFileRoute('/_authenticated/help-center/')({
  component: ComingSoon,
})
