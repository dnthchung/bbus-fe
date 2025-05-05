'use client'

import { useState } from 'react'
import { ScrollText, Globe } from 'lucide-react'
import BBusLogo from '@/assets/logo-bbus-2.svg'
import { Button } from '@/components/ui/button'

export default function Term() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi')

  return (
    <div className='relative min-h-screen bg-cover bg-center p-6' style={{ backgroundImage: `url('/images/9.jpg')` }}>
      <div className='mx-auto max-w-3xl rounded-lg bg-white/80 p-6 shadow-lg backdrop-blur-md'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img src={BBusLogo} alt='BBus Logo' className='h-10 w-10' />
            <h1 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <ScrollText className='h-5 w-5' />
              {lang === 'vi' ? 'Điều khoản dịch vụ' : 'Terms of Service'}
            </h1>
          </div>

          <div className='mt-4 flex items-center justify-between gap-2'>
            <Button variant='secondary' onClick={() => (window.location.href = '/sign-in')}>
              <span className='flex items-center gap-2'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                </svg>
                {lang === 'vi' ? 'Quay lại đăng nhập' : 'Back to Login'}
              </span>
            </Button>

            <Button variant='outline' size='sm' onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}>
              <Globe className='mr-2 h-4 w-4' />
              {lang === 'vi' ? 'EN' : 'VN'}
            </Button>
          </div>
        </div>

        {/* Nội dung */}
        <div className='max-h-[70vh] space-y-6 overflow-y-auto pr-2 text-sm leading-6 text-gray-800'>
          {/* Introduction */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Giới thiệu' : 'Introduction'}</h2>
            <p>{lang === 'vi' ? 'Hệ thống điểm danh thông minh trên xe buýt trường học (Smart Attendance on School Bus System – SASBS) là một giải pháp phần mềm tích hợp công nghệ nhận diện khuôn mặt AI và định vị GPS thời gian thực để quản lý quá trình học sinh lên và xuống xe buýt. Việc sử dụng hệ thống đồng nghĩa với việc bạn đồng ý tuân thủ các điều khoản dịch vụ được trình bày dưới đây.' : 'The Smart Attendance on School Bus System (SASBS) is a software solution integrating AI facial recognition and real-time GPS tracking to manage student boarding and drop-off on school buses. By using this system, you agree to comply with the following Terms of Service.'}</p>
          </div>

          {/* Scope of Use */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Phạm vi áp dụng' : 'Scope of Use'}</h2>
            <p>{lang === 'vi' ? 'Các điều khoản này áp dụng đối với toàn bộ người dùng hệ thống, bao gồm:' : 'These terms apply to all users of the system, including:'}</p>
            <ul className='mt-2 list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Phụ huynh và người giám hộ' : 'Parents and guardians'}</li>
              <li>{lang === 'vi' ? 'Giáo viên và cán bộ nhà trường' : 'Teachers and school staff'}</li>
              <li>{lang === 'vi' ? 'Tài xế và trợ lý tài xế xe buýt' : 'Bus drivers and assistant drivers'}</li>
              <li>{lang === 'vi' ? 'Quản trị viên hệ thống và quản trị viên trường' : 'System administrators and school administrators'}</li>
            </ul>
          </div>

          {/* User Rights and Responsibilities */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Quyền và Trách nhiệm của Người dùng' : 'User Rights and Responsibilities'}</h2>
            <h3 className='mb-1 mt-3 font-medium'>{lang === 'vi' ? 'Quyền của người dùng:' : 'User Rights:'}</h3>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Truy cập và sử dụng hệ thống theo vai trò đã được phân quyền.' : 'Access and use the system based on their assigned role.'}</li>
              <li>{lang === 'vi' ? 'Nhận thông báo tức thời khi học sinh lên hoặc xuống xe buýt.' : 'Receive real-time notifications when students board or leave the bus.'}</li>
              <li>{lang === 'vi' ? 'Theo dõi vị trí của xe buýt trong thời gian thực.' : "Monitor the bus's live location."}</li>
              <li>{lang === 'vi' ? 'Truy cập các báo cáo liên quan đến điểm danh và hoạt động xe buýt.' : 'Access attendance and transportation reports.'}</li>
            </ul>

            <h3 className='mb-1 mt-3 font-medium'>{lang === 'vi' ? 'Trách nhiệm của người dùng:' : 'User Responsibilities:'}</h3>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Bảo mật thông tin đăng nhập, không chia sẻ tài khoản.' : 'Secure login credentials and do not share accounts.'}</li>
              <li>{lang === 'vi' ? 'Cập nhật thông tin chính xác và đầy đủ.' : 'Provide accurate and up-to-date information.'}</li>
              <li>{lang === 'vi' ? 'Không lợi dụng hệ thống để gây rối, phát tán nội dung độc hại, hoặc vi phạm pháp luật.' : 'Do not misuse the system for disruption, spreading harmful content, or violating the law.'}</li>
              <li>{lang === 'vi' ? 'Thông báo ngay cho quản trị viên nếu phát hiện lỗi hoặc sự cố bảo mật.' : 'Report any errors or security incidents to the administrator promptly.'}</li>
            </ul>
          </div>

          {/* System Provider Responsibilities */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Nghĩa vụ của Hệ thống' : 'System Provider Responsibilities'}</h2>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Đảm bảo hệ thống vận hành ổn định, an toàn và bảo mật.' : 'Ensure stable, secure, and safe operation of the system.'}</li>
              <li>{lang === 'vi' ? 'Cung cấp hỗ trợ kỹ thuật kịp thời trong quá trình sử dụng.' : 'Provide timely technical support during system usage.'}</li>
              <li>{lang === 'vi' ? 'Cập nhật và nâng cấp tính năng hệ thống thường xuyên để cải thiện trải nghiệm người dùng.' : 'Regularly update and upgrade system features for better user experience.'}</li>
              <li>{lang === 'vi' ? 'Thông báo cho người dùng về bất kỳ thay đổi nào trong chính sách, điều khoản hoặc tính năng.' : 'Notify users of any changes in policy, terms, or features.'}</li>
            </ul>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Giới hạn trách nhiệm' : 'Limitation of Liability'}</h2>
            <p>{lang === 'vi' ? 'SASBS không chịu trách nhiệm trong các trường hợp:' : 'SASBS is not liable for:'}</p>
            <ul className='mt-2 list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Thiết bị của người dùng không tương thích hoặc hư hỏng.' : 'User device incompatibility or malfunction.'}</li>
              <li>{lang === 'vi' ? 'Vấn đề kết nối internet ảnh hưởng đến các tính năng thời gian thực.' : 'Internet connection issues affecting real-time features.'}</li>
              <li>{lang === 'vi' ? 'Sự bất cẩn hoặc vi phạm quy tắc sử dụng của người dùng.' : 'User negligence or violation of usage rules.'}</li>
            </ul>
          </div>

          {/* Suspension and Termination */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Tạm ngưng và chấm dứt dịch vụ' : 'Suspension and Termination'}</h2>
            <p>{lang === 'vi' ? 'SASBS có quyền tạm ngưng hoặc chấm dứt tài khoản người dùng nếu:' : 'SASBS reserves the right to suspend or terminate user accounts if:'}</p>
            <ul className='mt-2 list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Phát hiện vi phạm điều khoản dịch vụ.' : 'Violations of the Terms of Service are detected.'}</li>
              <li>{lang === 'vi' ? 'Hành vi gây nguy hiểm cho bảo mật hệ thống hoặc dữ liệu của người dùng khác.' : "Behavior jeopardizes system security or other users' data."}</li>
              <li>{lang === 'vi' ? 'Theo yêu cầu của cơ quan pháp luật hoặc ban quản lý nhà trường.' : 'Requested by legal authorities or the school management board.'}</li>
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}</h2>
            <p>{lang === 'vi' ? 'Chúng tôi cam kết bảo vệ dữ liệu cá nhân và thông tin học sinh được thu thập qua hệ thống SASBS. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu.' : 'We are committed to protecting personal data and student information collected via SASBS. This policy explains how we collect, use, store, and secure data.'}</p>

            <h3 className='mb-1 mt-3 font-medium'>{lang === 'vi' ? 'Dữ liệu được thu thập:' : 'Data Collected:'}</h3>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Thông tin người dùng: họ tên, số điện thoại, email, hình ảnh khuôn mặt.' : 'User information: full name, phone number, email, facial image.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu điểm danh: thời gian học sinh lên/xuống xe.' : 'Attendance data: student boarding/drop-off times.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu vị trí: GPS thời gian thực của xe buýt.' : 'Location data: real-time GPS of the bus.'}</li>
              <li>{lang === 'vi' ? 'Nhật ký hoạt động hệ thống.' : 'System activity logs.'}</li>
            </ul>

            <h3 className='mb-1 mt-3 font-medium'>{lang === 'vi' ? 'Bảo mật và lưu trữ:' : 'Data Security and Retention:'}</h3>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Dữ liệu được mã hóa và lưu trữ trên máy chủ bảo mật.' : 'Data is encrypted and stored on secure servers.'}</li>
              <li>{lang === 'vi' ? 'Áp dụng các tiêu chuẩn bảo mật như xác thực hai yếu tố (2FA).' : 'Security standards such as two-factor authentication (2FA) are applied.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu chỉ được lưu trữ trong thời gian cần thiết cho mục đích sử dụng.' : 'Data is retained no longer than necessary for its intended use.'}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Liên hệ' : 'Contact'}</h2>
            <p>{lang === 'vi' ? 'Mọi thắc mắc hoặc yêu cầu liên quan đến bảo mật xin liên hệ:' : 'For any privacy-related inquiries or requests, contact:'}</p>
            <p className='mt-1'>Email: support@sasbs.edu.vn</p>
            <p>{lang === 'vi' ? 'SĐT: 024-1234-5678' : 'Phone: +84-24-1234-5678'}</p>
          </div>

          {/* Changes to Terms */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Sửa đổi điều khoản' : 'Changes to Terms'}</h2>
            <p>{lang === 'vi' ? 'Các điều khoản này có thể được cập nhật tùy theo yêu cầu pháp lý, kỹ thuật hoặc điều chỉnh chính sách. Thông báo sẽ được gửi qua hệ thống hoặc email trước khi áp dụng.' : 'These terms may be updated based on legal, technical, or policy changes. Users will be notified via the system or email in advance of implementation.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
