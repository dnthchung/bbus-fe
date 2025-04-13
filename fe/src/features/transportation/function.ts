// //path : fe/src/features/transportation/function.ts
// import { API_SERVICES } from '@/api/api-services'
// import { Checkpoint, Route } from '@/features/transportation/schema'

// //get all checkpoint
// export async function getAllCheckpoints(): Promise<Checkpoint[]> {
//   try {
//     const response = await API_SERVICES.transportation.checkpoints.list()
//     const rawData = response.data
//     const rawCheckpoints = rawData?.data?.checkpoints
//     if (!rawCheckpoints) {
//       return []
//     }
//     // Parse & validate với Zod
//     return rawCheckpoints
//   } catch (error) {
//     console.error('Error getAllCheckpoints in checkpoints.ts:', error)
//     throw error
//   }
// }

// // get all route
