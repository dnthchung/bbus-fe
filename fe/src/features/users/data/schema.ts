// fe/src/features/users/data/schema.ts
import { z } from 'zod'

const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type UserStatus = z.infer<typeof userStatusSchema>

const roleEnum = z.enum(['ADMIN', 'PARENT', 'TEACHER', 'DRIVER', 'ASSISTANT', 'SYSADMIN'])

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dob: z.coerce.date(),
  email: z.string().email(),
  avatar: z.string().optional(),
  phone: z.string(),
  address: z.string(),
  status: userStatusSchema,
  role: roleEnum, // Change from `roles` to `role`
})

export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
