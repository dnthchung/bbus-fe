'use client'

import { useState } from 'react'
import { ShieldCheck, Globe } from 'lucide-react'
import BBusLogo from '@/assets/logo-bbus-2.svg'
import { Button } from '@/components/ui/button'

export default function Privacy() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi')

  return (
    <div className='relative min-h-screen bg-cover bg-center p-6' style={{ backgroundImage: `url('/images/9.jpg')` }}>
      <div className='mx-auto max-w-3xl rounded-lg bg-white/80 p-6 shadow-lg backdrop-blur-md'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img src={BBusLogo} alt='BBus Logo' className='h-10 w-10' />
            <h1 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <ShieldCheck className='h-5 w-5' />
              {lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
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
          {/* Commitment to Privacy */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Cam kết bảo mật' : 'Commitment to Privacy'}</h2>
            <p>{lang === 'vi' ? 'Chúng tôi cam kết bảo vệ dữ liệu cá nhân và thông tin học sinh được thu thập qua hệ thống SASBS. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu.' : 'We are committed to protecting personal data and student information collected via SASBS. This policy explains how we collect, use, store, and secure data.'}</p>
          </div>

          {/* Data Collected */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Dữ liệu được thu thập' : 'Data Collected'}</h2>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Thông tin người dùng: họ tên, số điện thoại, email, hình ảnh khuôn mặt.' : 'User information: full name, phone number, email, facial image.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu điểm danh: thời gian học sinh lên/xuống xe.' : 'Attendance data: student boarding/drop-off times.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu vị trí: GPS thời gian thực của xe buýt.' : 'Location data: real-time GPS of the bus.'}</li>
              <li>{lang === 'vi' ? 'Nhật ký hoạt động hệ thống.' : 'System activity logs.'}</li>
            </ul>
          </div>

          {/* Purpose of Data Use */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Mục đích sử dụng dữ liệu' : 'Purpose of Data Use'}</h2>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Quản lý điểm danh tự động và an toàn.' : 'Manage automated and secure attendance.'}</li>
              <li>{lang === 'vi' ? 'Gửi thông báo cho phụ huynh, giáo viên và tài xế.' : 'Send notifications to parents, teachers, and drivers.'}</li>
              <li>{lang === 'vi' ? 'Cung cấp báo cáo và phân tích hoạt động.' : 'Provide reports and operational analysis.'}</li>
              <li>{lang === 'vi' ? 'Nâng cao an toàn và minh bạch cho học sinh.' : 'Enhance student safety and transparency.'}</li>
            </ul>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Chia sẻ dữ liệu' : 'Data Sharing'}</h2>
            <p>{lang === 'vi' ? 'Thông tin chỉ được chia sẻ trong phạm vi nội bộ giữa các vai trò hệ thống và không chia sẻ với bên thứ ba, trừ khi:' : 'Data is shared internally among system roles only, and not with third parties unless:'}</p>
            <ul className='mt-2 list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Có sự đồng ý của người dùng.' : 'User consent is obtained.'}</li>
              <li>{lang === 'vi' ? 'Theo yêu cầu của pháp luật hoặc cơ quan chức năng.' : 'Required by law or legal authorities.'}</li>
            </ul>
          </div>

          {/* Data Security and Retention */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Bảo mật và lưu trữ' : 'Data Security and Retention'}</h2>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Dữ liệu được mã hóa và lưu trữ trên máy chủ bảo mật.' : 'Data is encrypted and stored on secure servers.'}</li>
              <li>{lang === 'vi' ? 'Áp dụng các tiêu chuẩn bảo mật như xác thực hai yếu tố (2FA).' : 'Security standards such as two-factor authentication (2FA) are applied.'}</li>
              <li>{lang === 'vi' ? 'Dữ liệu chỉ được lưu trữ trong thời gian cần thiết cho mục đích sử dụng.' : 'Data is retained no longer than necessary for its intended use.'}</li>
            </ul>
          </div>

          {/* User Rights */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Quyền của người dùng' : 'User Rights'}</h2>
            <ul className='list-disc space-y-1 pl-6'>
              <li>{lang === 'vi' ? 'Xem, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân.' : 'View, edit, or request deletion of personal data.'}</li>
              <li>{lang === 'vi' ? 'Rút lại sự đồng ý cho việc xử lý dữ liệu.' : 'Withdraw consent to data processing.'}</li>
              <li>{lang === 'vi' ? 'Gửi khiếu nại về bất kỳ vi phạm quyền riêng tư nào.' : 'File complaints for any privacy violations.'}</li>
            </ul>
          </div>

          {/* Children's Data */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Dữ liệu trẻ em' : "Children's Data"}</h2>
            <p>{lang === 'vi' ? 'Hệ thống chỉ thu thập dữ liệu học sinh dưới 16 tuổi khi có sự đồng ý rõ ràng từ phụ huynh hoặc người giám hộ.' : 'The system collects data of students under 16 only with explicit parental or guardian consent.'}</p>
          </div>

          {/* Contact */}
          <div>
            <h2 className='mb-2 text-lg font-semibold'>{lang === 'vi' ? 'Liên hệ' : 'Contact'}</h2>
            <p>{lang === 'vi' ? 'Mọi thắc mắc hoặc yêu cầu liên quan đến bảo mật xin liên hệ:' : 'For any privacy-related inquiries or requests, contact:'}</p>
            <p className='mt-1'>Email: support@sasbs.edu.vn</p>
            <p>{lang === 'vi' ? 'SĐT: 024-1234-5678' : 'Phone: +84-24-1234-5678'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
