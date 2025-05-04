// path: fe/src/features/settings/profile/components/profile-form.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChangeAvatarTab from './tab/change-avatar-tab'
import InformationTab from './tab/change-information-tab'
import ChangePasswordTab from './tab/change-password-tab'

export default function ProfilePage() {
  return (
    <Tabs defaultValue='information' className='space-y-6'>
      <TabsList>
        <TabsTrigger value='information'>Thông tin cá nhân</TabsTrigger>
        <TabsTrigger value='password'>Đổi mật khẩu</TabsTrigger>
        <TabsTrigger value='avatar'>Đổi ảnh đại diện</TabsTrigger>
      </TabsList>

      <TabsContent value='information'>
        <InformationTab />
      </TabsContent>

      <TabsContent value='password'>
        <ChangePasswordTab />
      </TabsContent>

      <TabsContent value='avatar'>
        <ChangeAvatarTab />
      </TabsContent>
    </Tabs>
  )
}
