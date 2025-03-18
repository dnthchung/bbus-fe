//path: fe/src/features/transportation/checkpoints/context/checkpoints-context.tsx
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Checkpoint } from '../data/schema'

type CheckpointsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

interface CheckpointsContextType {
  open: CheckpointsDialogType | null
  setOpen: (dialog: CheckpointsDialogType | null) => void
  currentRow: Checkpoint | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Checkpoint | null>>
}

const CheckpointsContext = React.createContext<CheckpointsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CheckpointsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CheckpointsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Checkpoint | null>(null)

  return <CheckpointsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</CheckpointsContext.Provider>
}

export const useCheckpoints = () => {
  const context = React.useContext(CheckpointsContext)
  if (!context) {
    throw new Error('useCheckpoints must be used within <CheckpointsProvider>')
  }
  return context
}
