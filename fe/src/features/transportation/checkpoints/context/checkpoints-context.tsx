'use client'

import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { getAllCheckpoints } from '../data/functions'
import { Checkpoint } from '../data/schema'

// path: fe/src/features/transportation/checkpoints/context/checkpoints-context.tsx

type CheckpointsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

interface CheckpointsContextType {
  // Dialog state
  open: CheckpointsDialogType | null
  setOpen: (dialog: CheckpointsDialogType | null) => void
  currentRow: Checkpoint | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Checkpoint | null>>

  // Data state
  checkpoints: Checkpoint[]
  setCheckpoints: React.Dispatch<React.SetStateAction<Checkpoint[]>>
  loading: boolean
  error: Error | null
  refreshCheckpoints: () => Promise<void>
}

const CheckpointsContext = React.createContext<CheckpointsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CheckpointsProvider({ children }: Props) {
  // Dialog state
  const [open, setOpen] = useDialogState<CheckpointsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Checkpoint | null>(null)

  // Data state
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshCheckpoints = async () => {
    try {
      setLoading(true)
      const parsedCheckpoints = await getAllCheckpoints()
      setCheckpoints(parsedCheckpoints)
      setError(null)
    } catch (err) {
      console.error('Error fetching checkpoints:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCheckpoints()
  }, [])

  return (
    <CheckpointsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        checkpoints,
        setCheckpoints,
        loading,
        error,
        refreshCheckpoints,
      }}
    >
      {children}
    </CheckpointsContext.Provider>
  )
}

export const useCheckpoints = () => {
  const context = React.useContext(CheckpointsContext)
  if (!context) {
    throw new Error('useCheckpoints must be used within <CheckpointsProvider>')
  }
  return context
}
