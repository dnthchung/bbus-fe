// // src/stores/authStore.ts
// import { getUserIdFromToken } from '@/helpers/jwt-decode'
// import { create } from 'zustand'
// import { API_SERVICES } from '@/api/api-services'

// interface AuthUser {
//   accountNo: string
//   email: string
//   role: string[]
//   exp: number
// }

// interface AuthState {
//   user: AuthUser | null
//   isAuthenticated: boolean
//   // fetchUser: () => Promise<void>
//   logout: () => Promise<void>
// }
// // const navigate = useNavigate()

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   // isAuthenticated: false,
//   isAuthenticated: !!localStorage.getItem('isAuthenticated'), // Load trạng thái từ localStorage

//   // fetchUser: async () => {
//   //   try {
//   //     const { data } = await API_SERVICES.auth.fetchUser() // ✅ Gửi request để lấy user
//   //     console.log('fetch user authStore.ts')

//   //     set({ user: data, isAuthenticated: true })
//   //     localStorage.setItem('isAuthenticated', 'true') // ✅ Lưu trạng thái vào localStorage
//   //   } catch {
//   //     set({ user: null, isAuthenticated: false })
//   //     localStorage.removeItem('isAuthenticated')
//   //   }
//   // },

//   logout: async () => {
//     // await apiClient.get('/auth/logout')
//     await API_SERVICES.auth.logout() // ✅ Gửi request để logout
//     set({ user: null, isAuthenticated: false })
//     console.log('logout authStore.ts')
//     localStorage.removeItem('accessToken') // Xóa token
//     localStorage.removeItem('isAuthenticated') // ✅ Xóa trạng thái
//     window.location.href = '/sign-in'
//     // navigate({ to: '/sign-in' })
//   },
// }))

// // ✅ Tự động fetch user sau khi reload
// if (localStorage.getItem('isAuthenticated') === 'true') {
//   localStorage.getItem('accessToken')
//   // Extract userId from JWT token
//   const userId = getUserIdFromToken('accessToken')
//   console.log('Decoded userId - (authStore):', userId)
//   // useAuthStore.getState().fetchUser()
//   API_SERVICES.auth
//     .fetchUser(userId)
//     .then(({ data }) => {
//       useAuthStore.setState({ user: data, isAuthenticated: true })
//     })
//     .catch(() => {
//       useAuthStore.setState({ user: null, isAuthenticated: false })
//       localStorage.removeItem('isAuthenticated')
//     })
// }
