// //path: fe/src/features/students/context/students-context.tsx
// import React, { useState } from 'react'
// import useDialogState from '@/hooks/use-dialog-state'
// import { Student } from '../data/schema'
// type StudentsDialogType = 'add' | 'edit' | 'delete' | 'import' | 'export'
// interface StudentsContextType {
//   open: StudentsDialogType | null
//   setOpen: (str: StudentsDialogType | null) => void
//   currentRow: Student | null
//   setCurrentRow: React.Dispatch<React.SetStateAction<Student | null>>
// }
// const StudentsContext = React.createContext<StudentsContextType | null>(null)
// interface Props {
//   children: React.ReactNode
// }
// export default function StudentsProvider({ children }: Props) {
//   const [open, setOpen] = useDialogState<StudentsDialogType>(null)
//   const [currentRow, setCurrentRow] = useState<Student | null>(null)
//   return <StudentsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</StudentsContext.Provider>
// }
// export const useStudents = () => {
//   const studentsContext = React.useContext(StudentsContext)
//   if (!studentsContext) {
//     throw new Error('useStudents has to be used within <StudentsProvider>')
//   }
//   return studentsContext
// }
// path: fe/src/features/students/context/students-context.tsx
import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Student } from '../data/schema'
import { getAllStudents } from '../data/students'

type StudentsDialogType = 'add' | 'edit' | 'delete' | 'import' | 'export'

interface StudentsContextType {
  // Dialog state
  open: StudentsDialogType | null
  setOpen: (str: StudentsDialogType | null) => void
  currentRow: Student | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Student | null>>

  // Student data state
  students: Student[]
  loading: boolean
  error: Error | null
  refreshStudents: () => Promise<void>
}

const StudentsContext = React.createContext<StudentsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function StudentsProvider({ children }: Props) {
  // Dialog state
  const [open, setOpen] = useDialogState<StudentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Student | null>(null)

  // Student data state
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Function to fetch students that can be called whenever needed
  const refreshStudents = async () => {
    try {
      setLoading(true)
      const parsedStudents = await getAllStudents()
      setStudents(parsedStudents)
      setError(null)
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    refreshStudents()
  }, [])

  return (
    <StudentsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        students,
        loading,
        error,
        refreshStudents,
      }}
    >
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => {
  const studentsContext = React.useContext(StudentsContext)
  if (!studentsContext) {
    throw new Error('useStudents has to be used within <StudentsProvider>')
  }
  return studentsContext
}
