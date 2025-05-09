// fe/src/features/users/data/users.ts
import { API_SERVICES } from '@/api/api-services'
import { Parent } from '@/features/users/schema'
import { userListSchema, User, parentListSchema } from '@/features/users/schema'

// hoặc đường dẫn tới file khai báo axios

/**
 * Gọi API lấy danh sách user, parse bằng Zod, trả về mảng User.
 */
// export async function getAllUsers(page = 1, size = 20): Promise<User[]> {
export async function getAllUsers(): Promise<User[]> {
  try {
    // Gọi API (đã được cấu hình token interceptor)
    // Ví dụ, nếu API_SERVICES.users.list(page, size) => "/user/list?page=...&size=..."
    const response = await API_SERVICES.users.list()

    // Phản hồi của Axios thường nằm ở response.data
    // Ví dụ: response.data = { status: 200, message: "user list", data: {...} }
    const rawData = response.data
    // console.log('rawData', rawData)
    // Mảng user có thể ở rawData.data.users
    const rawUsers = rawData?.data?.users
    // console.log('rawUsers', rawUsers)
    if (!rawUsers) {
      // Nếu không có dữ liệu users, trả về mảng rỗng
      return []
    }

    // Parse & validate với Zod
    const parsedUsers = userListSchema.parse(rawUsers)
    return parsedUsers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } catch (error) {
    console.error('Error getAllUsers in users.ts:', error)
    // Nếu lỗi, có thể return [] hoặc throw tùy bạn
    throw error
  }
}

export async function getAllUsersRoleParent(): Promise<User[]> {
  try {
    const response = await API_SERVICES.users.list()
    const rawData = response.data
    const rawUsers = rawData?.data?.users
    if (!rawUsers) {
      return []
    }

    // Parse & validate với Zod
    const parsedUsers11 = userListSchema.parse(rawUsers)
    // Lọc danh sách user có role = "PARENT"
    const parentUsers = parsedUsers11.filter((user: User) => user.role === 'PARENT')
    return parentUsers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } catch (error) {
    console.error('Error getAllUsers in users.ts:', error)
    throw error
  }
}

export async function getParentListFromParentTable(): Promise<Parent[]> {
  try {
    const response = await API_SERVICES.parents.getParentList()
    console.log('response', response)
    const rawData = response.data.data
    const rawParents = rawData.parents
    if (!rawParents) {
      return []
    }

    // console.log('=== rawParents', rawParents)
    // Parse & validate with Zod
    const parsedParents = parentListSchema.parse(rawParents)
    return parsedParents
  } catch (error) {
    console.error('Error getParentListFromParentTable in users.ts:', error)
    throw error
  }
}

export async function getUserById(userId: string): Promise<User> {
  try {
    const response = await API_SERVICES.users.getOne(userId)
    const rawData = response.data
    const userDetails = rawData?.data
    // console.log('rawData', rawData)
    // console.log('rawUser', rawData.data)

    if (!userDetails) {
      throw new Error('User not found')
    }

    return userDetails
  } catch (error) {
    console.error(`Error get user details by id ${userId} in users.ts:`, error)
    throw error
  }
}

export async function getParentIdByGetEntityByUserId(userId: string): Promise<User> {
  try {
    const response = await API_SERVICES.users.getUserEntity(userId)
    const rawData = response.data
    const userDetails = rawData?.data
    console.log('response', userDetails.id)

    if (!userDetails) {
      throw new Error('User not found')
    }
    const parentRealDetailsId = userDetails.id

    return parentRealDetailsId
  } catch (error) {
    console.error(`Error get parent entity by user id ${userId} in users.ts:`, error)
    throw error
  }
}

// ... existing code ...

/**
 * Lấy tất cả người dùng ngoại trừ SYSADMIN và ADMIN
 * @returns Danh sách người dùng không có quyền SYSADMIN và ADMIN
 */
export async function getAllUsersExceptAdmins(): Promise<User[]> {
  try {
    const response = await API_SERVICES.users.list()
    const rawData = response.data
    const rawUsers = rawData?.data?.users

    if (!rawUsers) {
      return []
    }

    const parsedUsers11 = userListSchema.parse(rawUsers)

    // Lọc danh sách user không có role là "SYSADMIN" hoặc "ADMIN"
    const filteredUsers = parsedUsers11.filter((user: User) => user.role !== 'SYSADMIN' && user.role !== 'ADMIN')

    // Parse & validate với Zod
    return filteredUsers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } catch (error) {
    console.error('Error getAllUsersExceptAdmins in users.ts:', error)
    throw error
  }
}

/**
 * Lấy tất cả người dùng có quyền SYSADMIN và ADMIN
 * @returns Danh sách người dùng có quyền SYSADMIN và ADMIN
 */
export async function getAllAdminUsers(): Promise<User[]> {
  try {
    const response = await API_SERVICES.users.list()
    const rawData = response.data
    const rawUsers = rawData?.data?.users

    if (!rawUsers) {
      return []
    }

    // Lọc danh sách user có role là "SYSADMIN" hoặc "ADMIN"
    const adminUsers = rawUsers.filter((user: User) => user.role === 'SYSADMIN' || user.role === 'ADMIN')

    // Parse & validate với Zod
    const parsedUsers = userListSchema.parse(adminUsers)

    return parsedUsers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } catch (error) {
    console.error('Error getAllAdminUsers in users.ts:', error)
    throw error
  }
}
