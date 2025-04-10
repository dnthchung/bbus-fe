//path : fe/src/routes/_authenticated/settings/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsProfile from '@/features/settings/profile'
import { withRoleRoute } from '@/guards/with-role-route'


export const Route = createLazyFileRoute('/_authenticated/settings/')({
  component: withRoleRoute(SettingsProfile, ['ADMIN']),
})
