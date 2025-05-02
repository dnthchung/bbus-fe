import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'

//path : fe/src/features/transportation/function.ts

//chọn DS tuyến đường ở sidebar => thấy được DS checkpoint và có hiển thị số lượng học sinh đã đăng ký checkpoint đó cho mỗi checkpoint
//admin chọn 1 checkpoint bất kì => sẽ thấy được DS xe bus tại checkpoint và DS student tại check point đó

// Function to get list of buses by checkpoint ID
// result like : [ { "id": "5824f7ed-2a08-4701-8ed3-255481a77ff3", "licensePlate": "29B-12346", "name": "Bus 002", "driverId": "fabb451b-5740-41ac-8353-e12532b7894c", "driverName": "driver1", "driverPhone": "0912345679", "assistantId": "83bcd928-ed7e-422f-a57c-49a52f34223b", "assistantName": "assistant", "assistantPhone": "0912345670", "amountOfStudents": 0, "routeId": "037cc590-ff8f-432e-8dde-b61858a99b9a", "routeCode": "R003", "espId": "002001", "cameraFacesluice": null, "busStatus": "ACTIVE" }, { "id": "a86c203c-4774-430d-821d-9668832aaace", "licensePlate": "29H-67891", "name": "Bus 001", "driverId": "6946cf4c-9e26-4305-9541-3e7680b104f9", "driverName": "teacher", "driverPhone": "0912345674", "assistantId": "11f25ff7-ab4b-4328-9e61-548a38c987f3", "assistantName": "assistantdriver", "assistantPhone": "0912345676", "amountOfStudents": 11, "routeId": "037cc590-ff8f-432e-8dde-b61858a99b9a", "routeCode": "R003", "espId": "001001", "cameraFacesluice": "1001001", "busStatus": "ACTIVE" } ]
export async function getBusesByCheckpointId(checkpointId: string) {
  try {
    const response = await API_SERVICES.buses.get_list_bus_by_checkpoint_id(checkpointId)
    const listBus = response.data.data
    // console.log('1. list Bus của checkpoint => ', listBus)
    return listBus
  } catch (error) {
    // console.error('Error fetching buses by checkpoint ID:', error)
    throw error
  }
}

// Function to get list of students by checkpoint ID - url /checkpoint/students?checkpointId=080e0ee6-a265-48c1-a8d5-f00cc28fbe47
//result like :[ { "studentId": "a3f99971-bb1b-4ca0-84bd-d01f8f4c779c", "studentName": "Nguyễn Quang Lợi", "rollNumber": "HS170534", "registered": true, "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001" }, { "studentId": "cc099cf3-6edd-4225-82d7-38472020967e", "studentName": "Con user: parent1 và đón ở checkpoint Điểm dừng cổng ĐHQG", "rollNumber": "Test", "registered": true, "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001" }]
export async function getStudentsByCheckpointId(checkpointId: string) {
  try {
    const response = await API_SERVICES.students.get_list_student_by_checkpoint_id(checkpointId)
    const students = response.data.data
    // console.log('2. list student đăng ký checkpoint => ', students)
    return students
  } catch (error) {
    // console.error('Error fetching students by checkpoint ID:', error)
    throw error
  }
}

//function to get list checkpoint
//result like : [{ "id": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "name": "test", "description": "test", "latitude": "20.09872", "longitude": "107.02182", "status": "ACTIVE" }, { "id": "346b48c3-912f-456f-b2e2-4469260962e6", "name": "Cầu Chương Dương", "description": "Trạm xe buýt ở đầu cầu Chương Dương", "latitude": "21.033028", "longitude": "105.863672", "status": "INACTIVE" },...]
export async function getListCheckpoint() {
  try {
    const response = await API_SERVICES.checkpoints.get_all()
    // console.log('3. list checkpoint => ', response.data.data.checkpoints)
    return response.data.data.checkpoints
  } catch (error) {
    // console.error('Error fetching list checkpoint:', error)
    throw error
  }
}

//function get number of student in each checkpoint - url : http:localhost:8080/checkpoint/count-students?checkpointId=080e0ee6-a265-48c1-a8d5-f00cc28fbe47
//result like : 10
export async function getNumberOfStudentInEachCheckpoint(checkpointId: string) {
  try {
    const response = await API_SERVICES.checkpoints.count_students_of_one_checkpoint(checkpointId)
    const studentCount = response.data.data
    // console.log('4 studentCount => ', studentCount)
    return studentCount
  } catch (error) {
    // console.error('Error fetching number of student in each checkpoint:', error)
    throw error
  }
}

//function get a route by busId - url : /route/by-bus?busId=5824f7ed-2a08-4701-8ed3-255481a77ff3
//we can get get path (list checkpoint that be sort - thứ tự di chuyển) of route through this api
//result in listCheckpointInRoute : "080e0ee6-a265-48c1-a8d5-f00cc28fbe47 90cd0ab6-9bc0-42be-a996-6f47cfe2b04c 9c7dc267-6dc8-49b5-9f4c-1ba317cc516d 346b48c3-912f-456f-b2e2-4469260962e6"
//đây là chuỗi các id của các checkpoint trong route đó
//sau đó ta sẽ split chuỗi này thành mảng và lấy ra từng checkpointId theo thứ tự trong listCheckpoint (getCheckpointDetailByCheckpointId)
//để hiển thị trên map <= muốn hiển thị trên map haowjc lấy thông tin thì cần call hàm get checkpoint by checkpoinId trước đã
export async function getCheckpointsInARouteByBusId(checkpointId: string) {
  try {
    const req = await API_SERVICES.route.get_a_route_by_bus_id(checkpointId)
    const listCheckpointInRoute = req.data.data
    // console.log('5. list checkpoint in route => ', listCheckpointInRoute)
    return listCheckpointInRoute
  } catch (error) {
    toast({
      title: 'Error fetching list checkpoint in route',
      description: 'Error fetching list checkpoint in route',
      variant: 'deny',
    })
    // console.error('Error fetching list checkpoint in route:', error)
    throw error
  }
}

//function get checkpoint detail by checkpointId - url : /checkpoint/987ac0dd-4864-4f09-a165-caa41f52ec71
//result like : { "id": "987ac0dd-4864-4f09-a165-caa41f52ec71", "name": "Bến xe Mỹ Đình", "description": "Điểm đón xe buýt gần Bến xe Mỹ Đình", "latitude": "21.033781", "longitude": "105.782362", "status": "ACTIVE" }
export async function getCheckpointDetailByCheckpointId(checkpointId: string) {
  try {
    const req = await API_SERVICES.checkpoints.get_a_checkpoint_by_checkpoint_id(checkpointId)
    const checkpointDetail = req.data.data
    // console.log('6. checkpoint detail => ', checkpointDetail)
    return checkpointDetail
  } catch (error) {
    // console.error('Error fetching checkpoint detail:', error)
    return null
  }
}

//============================= route function ================================
//get all route
//result : [ { "id": "4a1f2450-27a1-4315-ac2e-a9fbe3678c7a", "code": "R002", "description": "Tuyến số 2", "path": "8cd00406-9545-49b7-b40b-4d2bba9446f2 90fc9498-d6c2-4fa4-9f48-266fbf8f1ebf 9018c45f-6cf2-48d5-a500-85a86ede3b2f", "periodStart": "2025-03-01", "periodEnd": "2025-06-01" }, { "id": "037cc590-ff8f-432e-8dde-b61858a99b9a", "code": "R003", "description": "Tuyến số 3", "path": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47 90cd0ab6-9bc0-42be-a996-6f47cfe2b04c 9c7dc267-6dc8-49b5-9f4c-1ba317cc516d 346b48c3-912f-456f-b2e2-4469260962e6", "periodStart": "2025-03-01", "periodEnd": "2025-06-01" }, { "id": "e137d296-8641-474f-8112-b7f4023c662a", "code": "R001", "description": "Tuyến số 1", "path": "d13b413f-508a-406a-9fd1-6f581fd73e58 882f1ff1-4013-4d0c-9608-acc007354e82 987ac0dd-4864-4f09-a165-caa41f52ec71 40c64531-8e7a-4294-9e48-e41f02f57e3b", "periodStart": "2025-03-01", "periodEnd": "2025-06-01" } ]
export async function getAllRoute() {
  try {
    const req = await API_SERVICES.route.get_all_route()
    const listRoute = req.data.routes
    // console.log('7. list route => ', listRoute)
    return listRoute
  } catch (error) {
    // console.log('error get all route => ', error)
    throw error
  }
}

//get a route by routeId
//url : /route/4a1f2450-27a1-4315-ac2e-a9fbe3678c7a
// result : { "id": "4a1f2450-27a1-4315-ac2e-a9fbe3678c7a", "code": "R002", "description": "Tuyến số 2", "path": "8cd00406-9545-49b7-b40b-4d2bba9446f2 90fc9498-d6c2-4fa4-9f48-266fbf8f1ebf 9018c45f-6cf2-48d5-a500-85a86ede3b2f", "periodStart": "2025-03-01", "periodEnd": "2025-06-01" }
// path là chuỗi các checkpointId của route đó, được sắp xếp theo thứ tự di chuyển, xuất phát từ trái qua phải dần
export async function getRouteByRouteId(routeId: string) {
  try {
    const req = await API_SERVICES.route.get_a_route_by_route_id(routeId)
    const route = req.data.data || req.data
    console.log('8. route => ', req)
    return route
  } catch (error) {
    // console.log('error get route by routeId => ', error)
    // Return a default object instead of throwing
    return { path: '' }
  }
}

//get bus list by route id
export async function getBusListByRouteId(routeId: string) {
  try {
    const req = await API_SERVICES.route.get_bus_list_by_route_id(routeId)
    const busList = req.data.data
    // console.log('9. bus list => ', busList)
    return busList
  } catch (error) {
    // console.log('error get bus list by route id => ', error)
    throw error
  }
}

//get list checkpoints by route id
//result : [ { "id": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "name": "test", "description": "test", "latitude": "20.09872", "longitude": "107.02182", "status": "ACTIVE" }, { "id": "9c7dc267-6dc8-49b5-9f4c-1ba317cc516d", "name": "Bến xe Giáp Bát", "description": "Trạm xe buýt ngay Bến xe Giáp Bát", "latitude": "20.995568", "longitude": "105.841293", "status": "ACTIVE" }, { "id": "346b48c3-912f-456f-b2e2-4469260962e6", "name": "Cầu Chương Dương", "description": "Trạm xe buýt ở đầu cầu Chương Dương", "latitude": "21.033028", "longitude": "105.863672", "status": "INACTIVE" }, { "id": "90cd0ab6-9bc0-42be-a996-6f47cfe2b04c", "name": "Hồ Hoàn Kiếm", "description": "Trạm xe buýt đối diện Hồ Hoàn Kiếm", "latitude": "21.028511", "longitude": "105.854203", "status": "ACTIVE" } ]
export async function getListCheckpointByRouteId(routeId: string) {
  try {
    // console.log('routeId => ', routeId)
    const req = await API_SERVICES.route.get_list_checkpoint_by_route_id(routeId)
    // Handle different response structures
    const listCheckpoint = req.data?.data || req.data || []
    // console.log('10. list checkpoint => ', listCheckpoint)
    return listCheckpoint
  } catch (error) {
    // console.log('error get list checkpoint by route id => ', error)
    return []
  }
}

//create a route
export async function createRoute(route: any, checkpointTime: any) {
  try {
    const req = await API_SERVICES.route.create_a_route(route, checkpointTime)
    const newRoute = req.data.data
    // console.log('11. new route => ', newRoute)
  } catch (error) {
    toast({
      title: 'Tạo tuyến xe thất bại',
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'deny',
    })
    // console.log('error create route => ', error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

//get all checkpoint but not in route
//result :
export async function getAllCheckpointButNotInRoute() {
  try {
    const req = await API_SERVICES.checkpoints.get_all_checkpoint_no_route()
    const listCheckpoint = req.data.data || req.data
    // console.log('12. list checkpoint => ', listCheckpoint)
    return listCheckpoint
  } catch (error) {
    // console.log('error get all checkpoint but not in route => ', error)
    return []
  }
}

export async function getAllCheckpointButNotInRouteWithoutInActive() {
  try {
    const req = await API_SERVICES.checkpoints.get_all_checkpoint_no_route()
    const listCheckpoint = req.data.data || req.data || []
    const activeCheckpoints = listCheckpoint.filter((cp: any) => cp.status === 'ACTIVE')
    return activeCheckpoints
  } catch (error) {
    return []
  }
}

//edit route by routeId
export async function editRouteByRouteId(routeId: string, orderedCheckpointIds: string[], orderedCheckpointTimes: string[]) {
  try {
    console.log('orderedCheckpointTimes: ', orderedCheckpointTimes)
    await API_SERVICES.route.edit_route_by_route_id(routeId, orderedCheckpointIds, orderedCheckpointTimes)
  } catch (error) {
    toast({
      title: 'Cập nhật tuyến xe thất bại',
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'deny',
    })
    throw error
  }
}

//delete route by routeId
export async function deleteRouteByRouteId(routeId: string) {
  try {
    const req = await API_SERVICES.route.delete_a_route(routeId)
    // console.log('14. delete route => ', req.data.data)
    return req.data.data
  } catch (error) {
    toast({
      title: 'Xóa tuyến xe thất bại',
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'deny',
    })
    // console.log('error delete route => ', error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}
