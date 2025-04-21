// //path : src/routes/__root.tsx
// import { QueryClient } from '@tanstack/react-query'
// import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// // import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// // import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import { Toaster } from '@/components/ui/toaster'
// import GeneralError from '@/features/errors/general-error'
// import NotFoundError from '@/features/errors/not-found-error'
// export const Route = createRootRouteWithContext<{
//   queryClient: QueryClient
// }>()({
//   component: () => {
//     return (
//       <>
//         <Outlet />
//         <Toaster />
//         {import.meta.env.MODE === 'development' && (
//           <>
//             {/* <ReactQueryDevtools buttonPosition='bottom-left' />
//             <TanStackRouterDevtools position='bottom-right' /> */}
//           </>
//         )}
//       </>
//     )
//   },
//   notFoundComponent: NotFoundError,
//   errorComponent: GeneralError,
// })
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { useGlobalLoading } from '@/context/global-loading-context'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import { AdvancedBusLoader } from '@/components/mine/loader/advanced-bus-loader'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    const { isLoading } = useGlobalLoading()

    return (
      <>
        {isLoading && <AdvancedBusLoader size='full' animation='drive' variant='primary' text='Đang tải dữ liệu...' />}

        <Outlet />
        <Toaster />

        {import.meta.env.MODE === 'development' && (
          <>
            {/* <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' /> */}
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
