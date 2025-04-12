//path : src/features/transportation/routes/data/function.ts
import { API_SERVICES } from '@/api/api-services'

//chọn DS tuyến đường ở sidebar => thấy được DS checkpoint và có hiển thị số lượng học sinh đã đăng ký checkpoint đó cho mỗi checkpoint
//admin chọn 1 checkpoint bất kì => sẽ thấy được DS xe bus tại checkpoint và DS student tại check point đó

// Function to get list of buses by checkpoint ID
// result like : [ { "id": "5824f7ed-2a08-4701-8ed3-255481a77ff3", "licensePlate": "29B-12346", "name": "Bus 002", "driverId": "fabb451b-5740-41ac-8353-e12532b7894c", "driverName": "driver1", "driverPhone": "0912345679", "assistantId": "83bcd928-ed7e-422f-a57c-49a52f34223b", "assistantName": "assistant", "assistantPhone": "0912345670", "amountOfStudents": 0, "routeId": "037cc590-ff8f-432e-8dde-b61858a99b9a", "routeCode": "R003", "espId": "002001", "cameraFacesluice": null, "busStatus": "ACTIVE" }, { "id": "a86c203c-4774-430d-821d-9668832aaace", "licensePlate": "29H-67891", "name": "Bus 001", "driverId": "6946cf4c-9e26-4305-9541-3e7680b104f9", "driverName": "teacher", "driverPhone": "0912345674", "assistantId": "11f25ff7-ab4b-4328-9e61-548a38c987f3", "assistantName": "assistantdriver", "assistantPhone": "0912345676", "amountOfStudents": 11, "routeId": "037cc590-ff8f-432e-8dde-b61858a99b9a", "routeCode": "R003", "espId": "001001", "cameraFacesluice": "1001001", "busStatus": "ACTIVE" } ]
export async function getBusesByCheckpointId(checkpointId: string) {
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

// Function to get list of students by checkpoint ID - url /checkpoint/students?checkpointId=080e0ee6-a265-48c1-a8d5-f00cc28fbe47
//result like :[ { "studentId": "a3f99971-bb1b-4ca0-84bd-d01f8f4c779c", "studentName": "Nguyễn Quang Lợi", "rollNumber": "HS170534", "registered": true, "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001" }, { "studentId": "cc099cf3-6edd-4225-82d7-38472020967e", "studentName": "Con user: parent1 và đón ở checkpoint Điểm dừng cổng ĐHQG", "rollNumber": "Test", "registered": true, "busId": "a86c203c-4774-430d-821d-9668832aaace", "busName": "Bus 001" }]
export async function getStudentsByCheckpointId(checkpointId: string) {
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

//function to get list checkpoint
//result like : [{ "id": "080e0ee6-a265-48c1-a8d5-f00cc28fbe47", "name": "test", "description": "test", "latitude": "20.09872", "longitude": "107.02182", "status": "ACTIVE" }, { "id": "346b48c3-912f-456f-b2e2-4469260962e6", "name": "Cầu Chương Dương", "description": "Trạm xe buýt ở đầu cầu Chương Dương", "latitude": "21.033028", "longitude": "105.863672", "status": "INACTIVE" },...]
export async function getListCheckpoint() {
  try {
    const response = await API_SERVICES.checkpoints.get_all()
    console.log('3. list checkpoint => ', response.data.data.checkpoints)
    return response.data.data.checkpoints
  } catch (error) {
    console.error('Error fetching list checkpoint:', error)
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
    console.error('Error fetching number of student in each checkpoint:', error)
    throw error
  }
}

//function get danh sách buses by routeId - url /bus/by-route?routeId=037cc590-ff8f-432e-8dde-b61858a99b9a

//function get path of route by busId -
