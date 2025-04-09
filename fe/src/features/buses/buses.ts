// fe/src/features/buses/buses.ts
import { API_SERVICES } from '@/api/api-services'
import { busListSchema, Bus, busSchema } from '@/features/buses/schema'

// import { userSchema, userListSchema } from '@/features/users/schema'

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
    const response = await API_SERVICES.buses.get_detail(busId)
    const rawData = response.data
    const busData = rawData?.data?.bus || rawData?.data

    if (!busData) {
      console.error('No bus data found in response')
      throw new Error('Bus not found')
    }

    console.log('Raw bus data details:', busData)
    const parsedBus = busSchema.parse(busData)
    return parsedBus
  } catch (error) {
    console.error(`Error getBusById(${busId}) in buses.ts:`, error)
    throw error
  }
}

//api get list driver
export async function getAllDrivers() {
  try {
    const response = await API_SERVICES.drivers.get_all()
    const rawData = response.data
    const rawDrivers = rawData?.data?.drivers || rawData?.data

    if (!rawDrivers) {
      console.log('No drivers data found in response')
      return []
    }

    console.log('Raw drivers data:', rawDrivers)
    return rawDrivers
  } catch (error) {
    console.error('Error getAllDrivers in buses.ts:', error)
    throw error
  }
}

//api get list assistant
export async function getAllAssistants() {
  try {
    const response = await API_SERVICES.assistants.get_all()
    const rawData = response.data
    const rawAssistants = rawData?.data?.assistants || rawData?.data

    if (!rawAssistants) {
      console.log('No assistants data found in response')
      return []
    }

    console.log('Raw assistants data:', rawAssistants)
    return rawAssistants
  } catch (error) {
    console.error('Error getAllAssistants in buses.ts:', error)
    throw error
  }
}
