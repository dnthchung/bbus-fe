// src/routes/_authenticated/route.tsx
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { createFileRoute, Outlet, useNavigate, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { useAuthQuery } from '@/hooks/use-auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import SkipToMain from '@/components/common/skip-to-main'
import { AppSidebar } from '@/components/layout/app-sidebar'

function ProtectedRouteWithLayout() {
  const { user, isLoading } = useAuthQuery()
  const navigate = useNavigate()

  // Sử dụng useEffect để chuyển hướng sau khi render nếu không có user
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoading, user, navigate])

  // Trong khi chờ xác thực hoặc đang chuyển hướng, hiển thị loading state
  if (isLoading || (!user && !isLoading)) {
    return <div>Loading...</div>
  }

  // Lấy trạng thái mở sidebar từ cookie
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div id='content' className={cn('ml-auto w-full max-w-full', 'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]', 'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]', 'transition-[width] duration-200 ease-linear', 'flex h-svh flex-col', 'group-data-[scroll-locked=1]/body:h-full', 'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh')}>
          {/* Các route con sẽ được render tại đây */}
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

export const Route = createFileRoute('/_authenticated')({
  component: ProtectedRouteWithLayout,
})
