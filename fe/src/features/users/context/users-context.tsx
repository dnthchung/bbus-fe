//path: fe/src/features/users/context/users-context.tsx
// File này định nghĩa context cho tính năng quản lý người dùng
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { User } from '../data/schema'

// Định nghĩa các loại dialog có thể mở trong tính năng Users
type UsersDialogType = 'import' | 'add' | 'edit' | 'delete' | 'invite'

// Định nghĩa cấu trúc context sẽ được chia sẻ qua Provider
interface UsersContextType {
  open: UsersDialogType | null // Trạng thái dialog nào đang mở (hoặc null nếu không có dialog nào mở)
  setOpen: (str: UsersDialogType | null) => void // Hàm để mở/đóng dialog
  currentRow: User | null // Người dùng đang được thao tác (chỉnh sửa, xóa...)
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>> // Hàm để cập nhật người dùng đang thao tác
}

// Tạo context với giá trị mặc định là null
const UsersContext = React.createContext<UsersContextType | null>(null)

// Định nghĩa props cho component Provider
interface Props {
  children: React.ReactNode // Các components con sẽ được bọc bên trong Provider
}

// Component Provider chính - bọc toàn bộ tính năng Users
export default function UsersProvider({ children }: Props) {
  // Sử dụng hook useDialogState để quản lý trạng thái dialog
  const [open, setOpen] = useDialogState<UsersDialogType>(null)

  // State lưu trữ thông tin người dùng đang được thao tác
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  // Cung cấp các state và hàm điều khiển thông qua context
  return <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</UsersContext.Provider>
}

// Custom hook để các component con dễ dàng truy cập vào context
export const useUsers = () => {
  // Lấy giá trị từ context
  const usersContext = React.useContext(UsersContext)

  // Kiểm tra nếu hook được sử dụng bên ngoài Provider
  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>')
  }

  // Trả về các giá trị và hàm từ context
  return usersContext
}
