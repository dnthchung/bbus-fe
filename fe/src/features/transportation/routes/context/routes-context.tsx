//path : fe/src/features/transportation/routes/context/routes-context.tsx
import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { getAllRoute } from '@/features/transportation/function'
import { Route } from '@/features/transportation/schema'

// Assuming this exists

type RoutesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

interface RoutesContextType {
  open: RoutesDialogType | null
  setOpen: (str: RoutesDialogType | null) => void
  currentRow: Route | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Route | null>>

  // New: Data state
  routes: Route[]
  loading: boolean
  error: Error | null
  refreshRoutes: () => Promise<void>
}

const RoutesContext = React.createContext<RoutesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function RoutesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<RoutesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Route | null>(null)

  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshRoutes = async () => {
    try {
      setLoading(true)
      const parsedRoutes = await getAllRoute()
      setRoutes(parsedRoutes)
      setError(null)
    } catch (err) {
      console.error('Error fetching routes:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshRoutes()
  }, [])

  return (
    <RoutesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        routes,
        loading,
        error,
        refreshRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  )
}

export const useRoutes = () => {
  const routesContext = React.useContext(RoutesContext)
  if (!routesContext) {
    throw new Error('useRoutes has to be used within <RoutesProvider>')
  }
  return routesContext
}
