"use client"

import type { UseFormReturn } from "react-hook-form"
import type { Province, District, Ward } from "@/helpers/addressSimple"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserAddressProps {
  form: UseFormReturn<any>
  isEditing: boolean
  addressSimple: Province[]
  districts: District[]
  wards: Ward[]
  provinceValue: string | undefined
  districtValue: string | undefined
  wardValue: string | undefined
}

export function UserAddress({
  form,
  isEditing,
  addressSimple,
  districts,
  wards,
  provinceValue,
  districtValue,
  wardValue,
}: UserAddressProps) {
  return (
    <>
      {!isEditing ? (
        // Khi xem: chỉ hiển thị địa chỉ đầy đủ
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        // Khi chỉnh sửa: hiển thị các trường địa chỉ chi tiết
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Tỉnh/Thành phố */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addressSimple.map((province) => (
                        <SelectItem key={province.Id} value={province.Id || ""}>
                          {province.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quận/Huyện */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!provinceValue}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.Id} value={district.Id || ""}>
                          {district.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phường/Xã */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!districtValue}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.Id} value={ward.Id || ""}>
                          {ward.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Địa chỉ cụ thể */}
            <FormField
              control={form.control}
              name="specificAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ cụ thể</FormLabel>
                  <FormControl>
                    <Input placeholder="Số nhà, đường, ngõ..." {...field} disabled={!wardValue} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </>
  )
}
