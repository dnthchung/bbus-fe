//path : src/guards/with-role-route.tsx
import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthQuery } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

type AllowedRoles = string[] | 'all'

export function withRoleRoute<T extends object>(Component: React.ComponentType<T>, allowedRoles: AllowedRoles) {
  const WrappedComponent: React.FC<T> = (props: T) => {
    const { user, isLoading } = useAuthQuery()
    const navigate = useNavigate()

    useEffect(() => {
      // If not loading and we have a user
      if (!isLoading && user) {
        // Check if user has required role
        const userRole = user.role || ''
        const hasAccess = allowedRoles === 'all' || (Array.isArray(allowedRoles) && allowedRoles.includes(userRole))

        if (!hasAccess) {
          // Redirect to forbidden page if user doesn't have required role
          toast({
            title: 'Từ chối truy cập',
            description: 'Bạn không có quyền truy cập trang này.',
            variant: 'deny',
          })
          navigate({ to: '/' })
        }
      }
    }, [isLoading, user, navigate])

    // Show loading while checking authentication
    if (isLoading) {
      return <div>Loading...1</div>
    }

    // If user is not authenticated, the useAuthQuery hook will handle redirection
    if (!user) {
      return <div>Loading...2</div>
    }

    // Render the component if user has access
    return <Component {...props} />
  }

  // Assign a displayName for better debugging
  WrappedComponent.displayName = `withRoleRoute(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
