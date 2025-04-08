// path: src/hooks/use-role-permissions.ts
import { useAuthQuery } from './use-auth'

export function useRolePermissions() {
  const { user } = useAuthQuery()
  const userRole = user?.role || ''

  const isSysAdmin = userRole.includes('SYSADMIN')
  const isAdmin = userRole.includes('ADMIN')
  
  // Check if user has access to specific features
  const canAccessUserManagement = isSysAdmin
  const canAccessGeneralFeatures = isAdmin || isSysAdmin
  
  // Add more specific permission checks as needed
  const canAccessTransportation = isAdmin
  const canAccessStudents = isAdmin
  const canAccessReports = isAdmin
  const canAccessBuses = isAdmin

  return {
    isSysAdmin,
    isAdmin,
    canAccessUserManagement,
    canAccessGeneralFeatures,
    canAccessTransportation,
    canAccessStudents,
    canAccessReports,
    canAccessBuses
  }
}