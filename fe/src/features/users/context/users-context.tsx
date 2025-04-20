// //path: fe/src/features/users/context/users-context.tsx
// // File này định nghĩa context cho tính năng quản lý người dùng
// import React, { useState } from 'react'
// import useDialogState from '@/hooks/use-dialog-state'
// import { User } from '../data/schema'
// // Định nghĩa các loại dialog có thể mở trong tính năng Users - Thêm 1 cái view details
// type UsersDialogType = 'import' | 'add' | 'edit' | 'delete' | 'invite' | 'view-edit-details'
// // Định nghĩa cấu trúc context sẽ được chia sẻ qua Provider
// interface UsersContextType {
//   open: UsersDialogType | null // Trạng thái dialog nào đang mở (hoặc null nếu không có dialog nào mở)
//   setOpen: (str: UsersDialogType | null) => void // Hàm để mở/đóng dialog
//   currentRow: User | null // Người dùng đang được thao tác (chỉnh sửa, xóa...)
//   setCurrentRow: React.Dispatch<React.SetStateAction<User | null>> // Hàm để cập nhật người dùng đang thao tác
// }
// // Tạo context với giá trị mặc định là null
// const UsersContext = React.createContext<UsersContextType | null>(null)
// // Định nghĩa props cho component Provider
// interface Props {
//   children: React.ReactNode // Các components con sẽ được bọc bên trong Provider
// }
// // Component Provider chính - bọc toàn bộ tính năng Users
// export default function UsersProvider({ children }: Props) {
//   // Sử dụng hook useDialogState để quản lý trạng thái dialog
//   const [open, setOpen] = useDialogState<UsersDialogType>(null)
//   // State lưu trữ thông tin người dùng đang được thao tác
//   const [currentRow, setCurrentRow] = useState<User | null>(null)
//   // Cung cấp các state và hàm điều khiển thông qua context
//   return <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</UsersContext.Provider>
// }
// // Custom hook để các component con dễ dàng truy cập vào context
// export const useUsers = () => {
//   // Lấy giá trị từ context
//   const usersContext = React.useContext(UsersContext)
//   // Kiểm tra nếu hook được sử dụng bên ngoài Provider
//   if (!usersContext) {
//     throw new Error('useUsers has to be used within <UsersProvider>')
//   }
//   // Trả về các giá trị và hàm từ context
//   return usersContext
// }
// path: fe/src/features/users/context/users-context.tsx
import React, { useState, useEffect } from 'react'
// Giả sử bạn có API getAllUsers() hoặc API_SERVICES.users.getAll(), tuỳ cài đặt
import useDialogState from '@/hooks/use-dialog-state'
import { User } from '../schema'
import { getAllUsers, getAllAdminUsers , getAllUsersExceptAdmins } from '../users'

// Giả sử bạn có hàm này để lấy danh sách users

// Các loại dialog mà chúng ta quản lý
type UsersDialogType = 'import' | 'add' | 'edit' | 'delete' | 'invite' | 'view-edit-details'

// Cấu trúc context
interface UsersContextType {
  // 1) Quản lý dialog
  open: UsersDialogType | null
  setOpen: (dialogType: UsersDialogType | null) => void

  // 2) Quản lý user đang thao tác
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>

  // 3) Quản lý danh sách tất cả users
  users: User[]
  loading: boolean
  error: Error | null

  // 4) Hàm gọi lại API refresh users
  refreshUsers: () => Promise<void>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  // Quản lý dialog
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  // State cho danh sách Users
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Hàm fetch danh sách users từ API
  const refreshUsers = async () => {
    try {
      setLoading(true)
      //get role from local storage
      const role = localStorage.getItem('role')
      let userData: User[] = [];
      // Fetch users based on role
      if (role === 'ADMIN') {
        // ADMIN can see all users except those with ADMIN and SYSADMIN roles
        userData = await getAllUsersExceptAdmins();
      } else if (role === 'SYSADMIN') {
        // SYSADMIN can see only users with ADMIN and SYSADMIN roles
        userData = await getAllAdminUsers();
      } else {
        // Other roles can see all users
        userData = await getAllUsers();
      }
      
      setUsers(userData)
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Gọi fetch ban đầu
  useEffect(() => {
    refreshUsers()
  }, [])

  // Trả về context
  return (
    <UsersContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        users,
        loading,
        error,
        refreshUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

// Custom hook để sử dụng context dễ dàng
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)
  if (!usersContext) {
    throw new Error('useUsers must be used within <UsersProvider>')
  }
  return usersContext
}
