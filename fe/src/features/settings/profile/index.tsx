//path : fe/src/features/settings/profile/index.tsx
import ContentSection from '../components/content-section'
import ProfileForm from './components/profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection title='Tài khoản' desc='Quản lý thông tin tài khoản của bạn.'>
      <ProfileForm />
    </ContentSection>
  )
}
