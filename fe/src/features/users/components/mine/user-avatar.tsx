"use client"

import type React from "react"
import { Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/features/users/schema"
import type { FieldErrors } from "react-hook-form"

interface UserAvatarProps {
  avatarPreview: string | null
  userData: User | null
  defaultAvatarPath: string
  isEditing: boolean
  handleRemoveAvatar: () => void
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: FieldErrors<any>
}

export function UserAvatar({
  avatarPreview,
  userData,
  defaultAvatarPath,
  isEditing,
  handleRemoveAvatar,
  handleAvatarChange,
  formErrors,
}: UserAvatarProps) {
  return (
    <div className="mb-4 flex flex-col items-center space-y-2">
      <div className="relative">
        <Avatar className="h-24 w-24">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
          ) : userData?.avatar ? (
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt="User avatar" />
          ) : (
            <AvatarImage src={defaultAvatarPath || "/placeholder.svg"} alt="Default avatar" />
          )}
          <AvatarFallback>
            <span className="text-2xl">👤</span>
          </AvatarFallback>
        </Avatar>
        {isEditing && avatarPreview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemoveAvatar}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isEditing && (
        <div className="flex items-center">
          <label
            htmlFor="avatar-upload"
            className="flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Tải ảnh lên
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      )}
      {formErrors.avatar && <p className="text-sm text-destructive">{formErrors.avatar.message as string}</p>}
    </div>
  )
}
