import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { getAllBuses } from '@/features/buses/function'
import { Bus } from '@/features/buses/schema'

// Hàm giả định để lấy danh sách buses

// Các loại dialog mà chúng ta quản lý
type BusesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view-edit-details' | 'change-student-capacity'

// Cấu trúc context cho Buses
interface BusesContextType {
  // 1) Quản lý dialog
  open: BusesDialogType | null
  setOpen: (dialogType: BusesDialogType | null) => void

  // 2) Quản lý xe buýt đang thao tác
  currentRow: Bus | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Bus | null>>

  // 3) Quản lý danh sách tất cả xe buýt
  buses: Bus[]
  loading: boolean
  error: Error | null

  // 4) Hàm gọi lại API để refresh danh sách xe
  refreshBuses: () => Promise<void>
}

// Tạo Context
const BusesContext = React.createContext<BusesContextType | null>(null)

// Props cho Provider
interface Props {
  children: React.ReactNode
}

// Component Provider chính cho Buses
export default function BusesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<BusesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Bus | null>(null)

  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Hàm fetch danh sách xe buýt
  const refreshBuses = async () => {
    try {
      setLoading(true)
      const data = await getAllBuses()
      setBuses(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching buses:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Gọi fetch ban đầu
  useEffect(() => {
    refreshBuses()
  }, [])

  return (
    <BusesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        buses,
        loading,
        error,
        refreshBuses,
      }}
    >
      {children}
    </BusesContext.Provider>
  )
}

// Custom hook để sử dụng context buses
export const useBuses = () => {
  const context = React.useContext(BusesContext)
  if (!context) {
    throw new Error('useBuses must be used within <BusesProvider>')
  }
  return context
}
