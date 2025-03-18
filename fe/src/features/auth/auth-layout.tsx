//path : src/features/auth/auth-layout.tsx
import BBusLogo from '@/assets/bbus-logo.svg'
import BackGroundImage from '@/assets/images/beams.jpg'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div
      className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'
      // style={{
      //   backgroundImage: `url(${BackGroundImage})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 p-6 sm:w-[480px] lg:p-8'>
        {/* <div className='mx-auto flex w-full flex-col justify-center space-y-2 rounded-lg bg-white/80 p-6 shadow-lg sm:w-[480px] lg:p-8'> */}
        <div className='mb-4 flex items-center justify-center'>
          <img src={BBusLogo} alt='BBus Logo' className='mr-2 h-6 w-6' />
          <h1 className='text-xl font-medium'>BBus Admin</h1>
        </div>
        {children}
        {/* </div> */}
      </div>
    </div>
  )
}
