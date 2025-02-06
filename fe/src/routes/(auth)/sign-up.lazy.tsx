import { createLazyFileRoute } from '@tanstack/react-router'
import { withGuestRoute } from '@/guards/with-guest-route'
import SignUp from '@/features/auth/sign-up'

export const Route = createLazyFileRoute('/(auth)/sign-up')({
  // component: SignUp,
  component: withGuestRoute(SignUp),
})
