// src/hooks/use-breadcrumbs.ts
import { useRouterState } from '@tanstack/react-router'

export interface BreadcrumbItem {
  label: string
  path: string
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const state = useRouterState()
  const pathname = state.location.pathname

  // Map từ path sang tiêu đề
  const map: Record<string, string> = {
    '/dashboard': 'Tổng quan',
    '/students': 'Học sinh',
    '/students/details': 'Chi tiết học sinh',
    '/transportation/routes': 'Tuyến xe',
    // ... etc.
  }

  const segments = pathname.split('/').filter(Boolean)
  let currentPath = ''
  const breadcrumbs: BreadcrumbItem[] = segments.map((segment) => {
    currentPath += `/${segment}`
    return {
      label: map[currentPath] || segment,
      path: currentPath,
    }
  })

  return breadcrumbs
}
