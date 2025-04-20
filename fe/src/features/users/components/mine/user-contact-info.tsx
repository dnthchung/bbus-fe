import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface UserContactInfoProps {
  form: UseFormReturn<any>
  isEditing: boolean
}

export function UserContactInfo({ form, isEditing }: UserContactInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Số điện thoại */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số điện thoại</FormLabel>
            <FormControl>
              <Input placeholder="+84123456789" {...field} disabled={!isEditing} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Username - chỉ hiển thị, không cho phép sửa */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên đăng nhập</FormLabel>
            <FormControl>
              <Input {...field} disabled={true} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
