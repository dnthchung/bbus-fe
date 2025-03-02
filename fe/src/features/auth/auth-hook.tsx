// // src/hooks/useLogout.ts
// import { useNavigate } from '@tanstack/react-router';
// import { API_SERVICES } from '@/api/api-services';
// import { useAuthStore } from '@/stores/authStore';

// export const useLogout = () => {
//   const navigate = useNavigate();
//   const setAuthState = useAuthStore((state) => state.setState); // Access Zustand's setState

//   const logout = async () => {
//     try {
//       // Call the logout API
//       await API_SERVICES.auth.logout();

//       // Update Zustand store
//       setAuthState({ user: null, isAuthenticated: false });

//       // Clear localStorage
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('isAuthenticated');

//       // Navigate to sign-in page
//       navigate({ to: '/sign-in' });

//       console.log('Logout successful');
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error; // Optionally rethrow for error handling
//     }
//   };

//   return logout;
// };
