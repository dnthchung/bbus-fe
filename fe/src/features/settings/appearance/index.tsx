// import ContentSection from '../components/content-section'
// import { AppearanceForm } from './appearance-form'
// export default function SettingsAppearance() {
//   return (
//     <ContentSection
//       title='Appearance'
//       desc='Customize the appearance of the app. Automatically switch between day
//           and night themes.'
//     >
//       <AppearanceForm />
//     </ContentSection>
//   )
// }
import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  return (
    <ContentSection title='Giao diện' desc='Tùy chỉnh giao diện của ứng dụng. Tự động chuyển đổi giữa chế độ ban ngày và ban đêm.'>
      <AppearanceForm />
    </ContentSection>
  )
}
