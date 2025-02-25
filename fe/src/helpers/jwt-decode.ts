import { jwtDecode } from 'jwt-decode'

export const getUserIdFromToken = (token: string): string => {
  try {
    const decodedToken: any = jwtDecode(token)
    return decodedToken?.userId ? String(decodedToken.userId) : '1'
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return '1'
  }
}
