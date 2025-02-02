//path : src/routes/%28auth%29/sign-in.tsx
import { createFileRoute } from '@tanstack/react-router'
import { withGuestRoute } from '@/guards/withGuestRoute'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  // component: SignIn,
  component: withGuestRoute(SignIn),
})
