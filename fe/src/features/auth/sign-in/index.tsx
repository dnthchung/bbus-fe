// //path: src/features/auth/sign-in/index.tsx
// import { Card } from '@/components/ui/card'
// import AuthLayout from '../auth-layout'
// import { UserAuthForm } from './components/user-auth-form'
// export default function SignIn() {
//   return (
//     <AuthLayout>
//       <Card className='p-6'>
//         <div className='flex flex-col space-y-2 text-left'>
//           <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
//           <p className='text-sm text-muted-foreground'>
//             Enter your email and password below <br />
//             to log into your account
//           </p>
//         </div>
//         <UserAuthForm />
//         <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
//           By clicking login, you agree to our{' '}
//           <a
//             href='/terms'
//             className='underline underline-offset-4 hover:text-primary'
//           >
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a
//             href='/privacy'
//             className='underline underline-offset-4 hover:text-primary'
//           >
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </Card>
//     </AuthLayout>
//   )
// }
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  const { fetchUser } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (credentials: {
    email: string
    password: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      // Call the login API
      await apiClient.post('/auth/login', credentials)
      // Fetch user data after login
      await fetchUser()
      // Redirect to dashboard - dashboard is the home page so have : "/"
      navigate({ to: '/' })
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email and password below <br /> to log into your account
          </p>
        </div>
        {/* Pass our custom onSubmit, isLoading and error to the form */}
        <UserAuthForm
          onSubmit={handleLogin}
          isLoading={loading}
          error={error}
        />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          By clicking login, you agree to our{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Privacy Policy
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
