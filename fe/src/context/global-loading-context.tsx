import { createContext, useContext, useState } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (state: boolean) => void
}

const GlobalLoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const GlobalLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false)

  return <GlobalLoadingContext.Provider value={{ isLoading, setLoading }}>{children}</GlobalLoadingContext.Provider>
}

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext)
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider')
  }
  return context
}
