import { API_SERVICES } from '@/api/api-services'
// import { getNumberOfStudentInEachCheckpoint } from '@/features/transportation/function'
import { checkpointListSchema, Checkpoint } from './schema'

export async function getAllCheckpoints2(): Promise<Checkpoint[]> {
  try {
    const response = await API_SERVICES.checkpoints.get_all()
    // console.log('response', response)
    const rawData = response.data
    const rawCheckpoints = rawData?.data?.checkpoints
    if (!rawCheckpoints) {
      return []
    }
    const parsedCheckpoints = checkpointListSchema.parse(rawCheckpoints)
    return parsedCheckpoints
  } catch (error) {
    console.error('Error getAllCheckpoints in checkpoints.ts:', error)
    throw error
  }
}

export async function getAllCheckpoints(): Promise<Checkpoint[]> {
  try {
    const response = await API_SERVICES.checkpoints.get_all_with_student_count()
    // console.log('response', response)
    const rawData = response.data
    const rawCheckpoints = rawData?.data?.checkpoints
    // console.log('rawCheckpoints', rawCheckpoints)
    if (!rawCheckpoints) {
      return []
    }

    console.log('rawCheckpoints', rawCheckpoints)

    return rawCheckpoints
  } catch (error) {
    console.error('Error getAllCheckpoints in checkpoints.ts:', error)
    throw error
  }
}

// export async function getAllCheckpoints(): Promise<Checkpoint[]> {
//   try {
//     const response = await API_SERVICES.checkpoints.get_all()
//     const rawCheckpoints: Checkpoint[] = response.data.data.checkpoints

//     // Thêm số học sinh cho mỗi checkpoint
//     const checkpointsWithCounts = await Promise.all(
//       rawCheckpoints.map(async (cp) => {
//         const studentCount = await getNumberOfStudentInEachCheckpoint(cp.id)
//         return { ...cp, studentCount: studentCount || 0 }
//       })
//     )

//     return checkpointsWithCounts
//   } catch (error) {
//     console.error('Error getAllCheckpoints2 in checkpoints.ts:', error)
//     throw error
//   }
// }
