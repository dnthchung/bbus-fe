// fe/src/features/users/data/schema.ts
import { z } from 'zod'

const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export type UserStatus = z.infer<typeof userStatusSchema>

const roleEnum = z.enum(['ADMIN', 'PARENT', 'TEACHER', 'DRIVER', 'ASSISTANT', 'SYSADMIN'])

export const userSchema = z.object({
  userId: z.string(),
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
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof userSchema>
export const userListSchema = z.array(userSchema)

// ===== parent schema
export const parentSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  avatar: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dob: z.coerce.date(),
  status: userStatusSchema,
})

export type Parent = z.infer<typeof parentSchema>
export const parentListSchema = z.array(parentSchema)
