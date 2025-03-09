//path : src/helpers/jwt-decode.ts
// src/helpers/jwt-decode.ts
import { jwtDecode } from 'jwt-decode'

export const getUserIdFromToken = (token: string | null): string => {
  if (!token) {
    throw new Error('No token provided')
  }

  try {
    const decodedToken: any = jwtDecode(token)
    if (!decodedToken?.userId) {
      throw new Error('User ID not found in token')
    }
    return String(decodedToken.userId)
  } catch (error) {
    throw new Error(`Error decoding JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
