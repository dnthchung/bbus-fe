import { API_SERVICES } from '@/api/api-services'
import { checkpointListSchema, Checkpoint } from './schema'

export async function getAllCheckpoints(): Promise<Checkpoint[]> {
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
