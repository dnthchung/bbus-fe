// // fe/src/features/buses/list/components/page/page-view-details.tsx
// import { useEffect, useState } from 'react'
// import { useParams } from '@tanstack/react-router'
// import { Badge } from '@/components/ui/badge'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import { getAllBuses } from '@/features/buses/data/buses'
// import { Bus } from '@/features/buses/data/schema'
// export default function PageViewDetails() {
//   const { busId } = useParams({ strict: false })
//   const [currentRow, setCurrentRow] = useState<Bus | null>(null)
//   useEffect(() => {
//     const fetchBus = async () => {
//       const buses = await getAllBuses()
//       const bus = buses.find((b) => b.id === busId) || null
//       setCurrentRow(bus)
//     }
//     fetchBus()
//   }, [busId])
//   if (!currentRow) {
//     return <div>Không tìm thấy thông tin xe buýt.</div>
//   }
//   return (
//     <div className='mx-auto max-w-2xl p-4'>
//       <h1 className='text-xl font-bold'>Thông tin chi tiết xe buýt</h1>
//       <Separator className='my-2' />
//       <ScrollArea className='h-[400px] pr-4'>
//         <div className='space-y-4 text-sm'>
//           <div>
//             <p className='font-semibold'>Tên xe:</p>
//             <p>{currentRow.name}</p>
//           </div>
//           <div>
//             <p className='font-semibold'>Biển số xe:</p>
//             <p>{currentRow.licensePlate}</p>
//           </div>
//           <div>
//             <p className='font-semibold'>Tài xế:</p>
//             <p>{currentRow.driverName}</p>
//           </div>
//           <div>
//             <p className='font-semibold'>Tuyến đường:</p>
//             <p>{currentRow.route}</p>
//           </div>
//           <div>
//             <p className='font-semibold'>ESP ID:</p>
//             <Badge variant='secondary'>{currentRow.espId}</Badge>
//           </div>
//           <div>
//             <p className='font-semibold'>Camera ID:</p>
//             <Badge variant='secondary'>{currentRow.cameraFacesluice}</Badge>
//           </div>
//         </div>
//       </ScrollArea>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { getAllBuses } from '@/features/buses/data/buses'
import { Bus } from '@/features/buses/schema'

export default function PageViewDetails() {
  const { id } = useParams({ strict: false })
  // const [currentRow, setCurrentRow] = useState<Bus | null>(null)

  // function PageViewDetails() {
  //   const { id } = Route.useParams()
  //   const user = Route.useLoaderData()
  //   console.log('user', user)
  //   return <div>Hello "/_authenticated/buses/list/{id}"!</div>
  // }

  // if (!currentRow) {
  //   return <div>Không tìm thấy thông tin xe buýt.</div>
  // }

  return (
    <div className='mx-auto max-w-2xl p-4'>
      <h1 className='text-xl font-bold'>Thông tin chi tiết xe buýt {id}</h1>
      {/* Hiển thị thông tin chi tiết của xe buýt */}
    </div>
  )
}
