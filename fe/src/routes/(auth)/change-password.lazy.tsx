import { createLazyFileRoute } from '@tanstack/react-router'
import ChangePassword from '@/features/auth/change-password'

export const Route = createLazyFileRoute('/(auth)/change-password')({
  component: ChangePassword,
})
