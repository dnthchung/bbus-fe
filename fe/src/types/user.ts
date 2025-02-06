// src/types/user.ts
export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface UpdateProfileInput {
  name?: string
  email?: string
}
