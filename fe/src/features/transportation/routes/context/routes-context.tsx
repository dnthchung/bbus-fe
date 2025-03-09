// // path: fe/src/features/routes/context/routes-context.tsx
// import React, { useState } from 'react'
// import useDialogState from '@/hooks/use-dialog-state'
// // import { Route } from '../data/schema'

// type RoutesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

// interface RoutesContextType {
//   open: RoutesDialogType | null
//   setOpen: (str: RoutesDialogType | null) => void
//   currentRow: Route | null
//   setCurrentRow: React.Dispatch<React.SetStateAction<Route | null>>
// }

// const RoutesContext = React.createContext<RoutesContextType | null>(null)

// interface Props {
//   children: React.ReactNode
// }

// export default function RoutesProvider({ children }: Props) {
//   const [open, setOpen] = useDialogState<RoutesDialogType>(null)
//   const [currentRow, setCurrentRow] = useState<Route | null>(null)

//   return <RoutesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</RoutesContext.Provider>
// }

// export const useRoutes = () => {
//   const routesContext = React.useContext(RoutesContext)

//   if (!routesContext) {
//     throw new Error('useRoutes has to be used within <RoutesProvider>')
//   }

//   return routesContext
// }
