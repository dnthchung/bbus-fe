import BBusLogo from '@/assets/logo-bbus-2.svg'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div
      className='relative flex h-svh w-full items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: `url('/images/9.jpg')` }} // bạn có thể thay bằng image admin riêng nếu muốn
    >
      <div className='mx-auto w-full max-w-md space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur-md'>
        <div className='mb-4 flex items-center justify-center'>
          <img src={BBusLogo} alt='BBus Logo' className='mr-2 h-10 w-10' />
          <h1 className='text-xl font-medium'>BBus Admin</h1>
        </div>
        {children}
      </div>
    </div>
  )
}

// //path : src/features/auth/auth-layout.tsx
// import BBusLogo from '@/assets/bbus-logo.svg'

// interface Props {
//   children: React.ReactNode
// }

// export default function AuthLayout({ children }: Props) {
//   return (
//     <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
//       <div className='mx-auto flex w-full flex-col justify-center space-y-2 p-6 sm:w-[480px] lg:p-8'>
//         <div className='mb-4 flex items-center justify-center'>
//           <img src={BBusLogo} alt='BBus Logo' className='mr-2 h-6 w-6' />
//           <h1 className='text-xl font-medium'>BBus Admin</h1>
//         </div>
//         {children}
//         {/* </div> */}
//       </div>
//     </div>
//   )
// }
