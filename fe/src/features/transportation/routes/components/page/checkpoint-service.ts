import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'

// Types
export interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: string
  longitude: string
  status: string
}

export interface Student {
  studentId: string
  studentName: string
  rollNumber: string
  registered: boolean
  busId: string
  busName: string
}

export interface Bus {
  id: string
  licensePlate: string
  name: string
  driverId: string
  driverName: string
  driverPhone: string
  assistantId: string
  assistantName: string
  assistantPhone: string
  amountOfStudents: number
  routeId: string
  routeCode: string
  espId: string
  cameraFacesluice: string | null
  busStatus: string
}

export interface Route {
  id: string
  code: string
  description: string
  path: string
  periodStart: string
  periodEnd: string
}

// Function to get list of buses by checkpoint ID
export async function getBusesByCheckpointId(checkpointId: string): Promise<Bus[]> {
  try {
    const response = await API_SERVICES.buses.get_list_bus_by_checkpoint_id(checkpointId)
    const listBus = response.data.data
    console.log('1. list Bus của checkpoint => ', listBus)
    return listBus
  } catch (error) {
    console.error('Error fetching buses by checkpoint ID:', error)
    throw error
  }
}

// Function to get list of students by checkpoint ID
export async function getStudentsByCheckpointId(checkpointId: string): Promise<Student[]> {
  try {
    const response = await API_SERVICES.students.get_list_student_by_checkpoint_id(checkpointId)
    const students = response.data.data
    console.log('2. list student đăng ký checkpoint => ', students)
    return students
  } catch (error) {
    console.error('Error fetching students by checkpoint ID:', error)
    throw error
  }
}

// Function to get list checkpoint
export async function getListCheckpoint(): Promise<Checkpoint[]> {
  try {
    const response = await API_SERVICES.checkpoints.get_all()
    console.log('3. list checkpoint => ', response.data.data.checkpoints)
    return response.data.data.checkpoints
  } catch (error) {
    console.error('Error fetching list checkpoint:', error)
    throw error
  }
}

//get all checkpoint but not in route
// export async function getAllCheckpointButNotInRoute() {
//   try {
//     const req = await API_SERVICES.checkpoints.get_all_checkpoint_no_route()
//     const listCheckpoint = req.data.data || req.data
//     console.log('12. list checkpoint => ', listCheckpoint)
//     return listCheckpoint
//   } catch (error) {
//     console.log('error get all checkpoint but not in route => ', error)
//     return []
//   }
// }

export async function getAllCheckpointButNotInRoute(): Promise<Checkpoint[]> {
  try {
    const req = await API_SERVICES.checkpoints.get_all_checkpoint_no_route()
    const listCheckpoint = req.data?.data || req.data || []
    if (!Array.isArray(listCheckpoint)) {
      console.error('Invalid checkpoint data:', listCheckpoint)
      return []
    }
    return listCheckpoint
  } catch (error) {
    console.log('error get all checkpoint but not in route => ', error)
    return []
  }
}

// Function get number of student in each checkpoint
export async function getNumberOfStudentInEachCheckpoint(checkpointId: string): Promise<number> {
  try {
    const response = await API_SERVICES.checkpoints.count_students_of_one_checkpoint(checkpointId)
    const studentCount = response.data.data
    return studentCount
  } catch (error) {
    console.error('Error fetching number of student in each checkpoint:', error)
    throw error
  }
}

// Function get a route by busId
export async function getCheckpointsInARouteByBusId(busId: string): Promise<string> {
  try {
    const req = await API_SERVICES.route.get_a_route_by_bus_id(busId)
    const listCheckpointInRoute = req.data.data
    console.log('5. list checkpoint in route => ', listCheckpointInRoute)
    return listCheckpointInRoute
  } catch (error) {
    toast({
      title: 'Error fetching list checkpoint in route',
      description: 'Error fetching list checkpoint in route',
      variant: 'deny',
    })
    console.error('Error fetching list checkpoint in route:', error)
    throw error
  }
}

// Function get checkpoint detail by checkpointId
export async function getCheckpointDetailByCheckpointId(checkpointId: string): Promise<Checkpoint | null> {
  try {
    const req = await API_SERVICES.checkpoints.get_a_checkpoint_by_checkpoint_id(checkpointId)
    const checkpointDetail = req.data.data
    console.log('6. checkpoint detail => ', checkpointDetail)
    return checkpointDetail
  } catch (error) {
    console.error('Error fetching checkpoint detail:', error)
    return null
  }
}

// Route functions
export async function getAllRoute(): Promise<Route[]> {
  try {
    const req = await API_SERVICES.route.get_all_route()
    const listRoute = req.data.routes
    console.log('7. list route => ', listRoute)
    return listRoute
  } catch (error) {
    console.log('error get all route => ', error)
    throw error
  }
}

export async function getRouteByRouteId(routeId: string): Promise<Route> {
  try {
    const req = await API_SERVICES.route.get_a_route_by_route_id(routeId)
    const route = req.data.data
    console.log('8. route => ', route)
    return route
  } catch (error) {
    console.log('error get route by routeId => ', error)
    // Return a default object instead of throwing
    return { id: '', code: '', description: '', path: '', periodStart: '', periodEnd: '' }
  }
}

export async function getBusListByRouteId(routeId: string): Promise<Bus[]> {
  try {
    const req = await API_SERVICES.route.get_bus_list_by_route_id(routeId)
    const busList = req.data.data
    console.log('9. bus list => ', busList)
    return busList
  } catch (error) {
    console.log('error get bus list by route id => ', error)
    throw error
  }
}

export async function getListCheckpointByRouteId(routeId: string): Promise<Checkpoint[]> {
  try {
    const req = await API_SERVICES.route.get_list_checkpoint_by_route_id(routeId)
    // Handle different response structures
    const listCheckpoint = req.data?.data || req.data || []
    console.log('10. list checkpoint => ', listCheckpoint)
    return listCheckpoint
  } catch (error) {
    console.log('error get list checkpoint by route id => ', error)
    return []
  }
}
