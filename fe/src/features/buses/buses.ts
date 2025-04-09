// fe/src/features/buses/buses.ts
import { API_SERVICES } from '@/api/api-services'
import { busListSchema, Bus } from '@/features/buses/schema'

export async function getAllBuses(): Promise<Bus[]> {
  try {
    const response = await API_SERVICES.buses.get_all()
    const rawData = response.data
    const rawBuses = rawData?.data?.buses || rawData?.data

    if (!rawBuses) {
      console.log('No buses data found in response')
      return []
    }

    console.log('Raw buses data:', rawBuses)
    const parsedBuses = busListSchema.parse(rawBuses)
    return parsedBuses
  } catch (error) {
    console.error('Error getAllBuses in buses.ts:', error)
    throw error
  }
}

export async function getBusById(busId: string): Promise<Bus> {
  try {
    const response = await API_SERVICES.buses.get_all()
    const rawData = response.data
    const rawBuses = rawData?.data?.buses || rawData?.data

    if (!rawBuses) {
      throw new Error('Bus not found')
    }

    const bus = rawBuses.find((bus: any) => bus.id === busId)

    if (!bus) {
      throw new Error(`Bus with id ${busId} not found`)
    }

    return bus
  } catch (error) {
    console.error(`Error get bus details by id ${busId} in buses.ts:`, error)
    throw error
  }
}
