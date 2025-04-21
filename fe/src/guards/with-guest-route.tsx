//path : src/guards/with-guest-route.ts
import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthQuery } from '@/hooks/use-auth'

export function withGuestRoute<T extends object>(Component: React.ComponentType<T>) {
  const WrappedComponent: React.FC<T> = (props: T) => {
    const { user, isLoading } = useAuthQuery()
    const navigate = useNavigate()

    useEffect(() => {
      if (!isLoading && user) {
        navigate({ to: '/' })
      }
    }, [isLoading, user, navigate])

    if (isLoading || user) {
      return <div>Loading... 123</div>
    }

    return <Component {...props} />
  }

  // Assign a displayName for better Fast Refresh support and debugging
  WrappedComponent.displayName = `withGuestRoute(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
