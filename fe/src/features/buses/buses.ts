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

//get list driver available (not in bus )
export async function getAvailableDrivers() {
  try {
    const response = await API_SERVICES.drivers.get_all_available()
    const rawData = response.data
    const rawDrivers = rawData?.data?.drivers || rawData?.data

    if (!rawDrivers) {
      console.log('No available drivers data found in response')
      return []
    }

    console.log('Raw available drivers data:', rawDrivers)
    return rawDrivers
  } catch (error) {
    console.error('Error getAvailableDrivers in buses.ts:', error)
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

//get list assistant available (not in bus )
export async function getAvailableAssistants() {
  try {
    const response = await API_SERVICES.assistants.get_all_available()
    const rawData = response.data
    const rawAssistants = rawData?.data?.assistants || rawData?.data

    if (!rawAssistants) {
      console.log('No available assistants data found in response')
      return []
    }

    console.log('Raw available assistants data:', rawAssistants)
    return rawAssistants
  } catch (error) {
    console.error('Error getAvailableAssistants in buses.ts:', error)
    throw error
  }
}

//get all date for schedule
export async function getScheduledDatesByMonth(month: string): Promise<string[]> {
  try {
    const response = await API_SERVICES.bus_schedule.get_dates_by_month(month)
    const dates = response?.data?.data?.dates || []
    console.log('Fetched scheduled dates:', dates)
    return dates
  } catch (error) {
    console.error(`Error getScheduledDatesByMonth(${month}) in buses.ts:`, error)
    throw error
  }
}

// Delete scheduled dates
export async function deleteScheduledDates(dates: string): Promise<boolean> {
  try {
    const response = await API_SERVICES.bus_schedule.delete_batch(dates)
    console.log('Deleted scheduled dates response:', response)
    return response.success || response.status === 200
  } catch (error) {
    console.error(`Error deleteScheduledDates in buses.ts:`, error)
    throw error
  }
}

// Get list students in a bus by bus id
//url : /student/by-bus?busId=a86c203c-4774-430d-821d-9668832aaace
//details : [ { "id": "fe8bd282-b437-4e18-9c26-945df7b786ad", "rollNumber": "HS100003", "name": "Vũ Hoàng Long", "avatar": "HS100004.jpg", "dob": "1999-03-06T00:00:00.000+00:00", "address": "Ninh Bình", "gender": "MALE", "status": "ACTIVE", "parentId": "2886759c-3081-42d2-8e1a-897d75ee903e", "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001", "parent": { "userId": "cc702191-5f7d-4ee8-8c73-cd99ba552a39", "username": "7z0NT89r", "name": "PH của Nguyễn Văn Tên", "gender": "MALE", "dob": "2003-03-18", "email": "email@gmail.com", "avatar": "https://my-public-bucket-loinq.s3.ap-southeast-1.amazonaws.com/parents/HE170533.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250414T183642Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIAYHJANGBW7FNB6K3Y%2F20250414%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Expires=120&X-Amz-Signature=3d0be43687e788a211ace4f66532c7c445f9378642a8ce9564e06387bad86714", "phone": "0911145678", "address": "74 An Dương", "status": "ACTIVE", "role": "PARENT" }, "checkpointId": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "checkpointName": "test", "checkpointDescription": "test" }, { "id": "643d3c9c-8b71-4267-8c57-5cf410a32075", "rollNumber": "HS100002", "name": "Vũ Hoàng Long", "avatar": "HS100002.jpg", "dob": "1999-03-06T00:00:00.000+00:00", "address": "Ninh Bình", "gender": "MALE", "status": "ACTIVE", "parentId": "2886759c-3081-42d2-8e1a-897d75ee903e", "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001", "parent": { "userId": "cc702191-5f7d-4ee8-8c73-cd99ba552a39", "username": "7z0NT89r", "name": "PH của Nguyễn Văn Tên", "gender": "MALE", "dob": "2003-03-18", "email": "email@gmail.com", "avatar": "https://my-public-bucket-loinq.s3.ap-southeast-1.amazonaws.com/parents/HE170533.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250414T183642Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIAYHJANGBW7FNB6K3Y%2F20250414%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Expires=120&X-Amz-Signature=3d0be43687e788a211ace4f66532c7c445f9378642a8ce9564e06387bad86714", "phone": "0911145678", "address": "74 An Dương", "status": "ACTIVE", "role": "PARENT" }, "checkpointId": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "checkpointName": "test", "checkpointDescription": "test" },]
export async function getStudentsByBusId(busId: string): Promise<any> {
  try {
    const response = await API_SERVICES.buses.get_list_student_by_bus_id(busId)
    const rawData = response.data
    const rawStudents = rawData?.data || rawData
    return rawStudents
  } catch (error) {
    console.error(`Error getStudentsByBusId(${busId}) in buses.ts:`, error)
    throw error
  }
}
