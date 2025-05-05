// import { API_SERVICES } from '@/api/api-services'
// //url file : /src/features/students/attendance/functions.ts
// // get all student
// // result mẫu api trả về : [
// //   {
// //     "id": "0121732a-3267-4a00-b347-1c759069942d",
// //     "rollNumber": "HS00027",
// //     "name": "Hoàng Nam Vân",
// //     "avatar": "https://my-public-bucket-loinq.s3.ap-southeast-1.amazonaws.com/students/https%3A//my-public-bucket-loinq.s3.ap-southeast-1.amazonaws.com/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250418T064210Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIAYHJANGBW7FNB6K3Y%2F20250418%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Expires=120&X-Amz-Signature=85687a73928cd0d64f1f113c6a4cc7880538248bf9bac614899b797d61b69dd2",
// //     "dob": "2017-11-07T17:00:00.000+00:00",
// //     "address": "Số 52 Vũ Trọng Phụng, phường Khương Đình, Thanh Xuân, Hà Nội",
// //     "gender": "MALE",
// //     "status": "ACTIVE",
// //     "parentId": "0e17e054-d02e-4b2f-a553-1cef6f31def2",
// //     "busId": null,
// //     "busName": null,
// //     "parent": {
// //       "userId": "9a5d1727-be15-478a-810c-52523c11343d",
// //       "username": "XA5MvDly",
// //       "name": "Nguyễn Văn Phúc",
// //       "gender": "MALE",
// //       "dob": "1983  "XA5MvDly",
// //       "name": "Nguyễn Văn Phúc",
// //       "gender": "MALE",
// //       "dob": "1983-12-29",
// //       "email": "joanchen@reed.com",
// //       "avatar": "https://my-public-bucket-loinq.s3.ap-southeast-1.amazonaws.com/parents/https%3A//example.com/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250418T064211Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIAYHJANGBW7FNB6K3Y%2F20250418%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Expires=120&X-Amz-Signature=9e1232daf86bc1daad41b890b6a684cd07774de52522c9ceeac1d9e471b7aa3e",
// //       "phone": "0911145904",
// //       "address": "Số 52 Vũ Trọng Phụng, phường Khương Đình, Thanh Xuân, Hà Nội",
// //       "status": "ACTIVE",
// //       "role": "PARENT"
// //     },
// //     "checkpointId": null,
// //     "checkpointName": "Chưa có điểm đón",
// //     "checkpointDescription": "Chưa có điểm đón"
// //   },
// //   ...
// // ]
// export async function getAllStudent() {
//   try {
//     const req = await API_SERVICES.students.list()
//     const listStudent = req.data.data.students || req.data.students
//     console.log('1. list student => ', listStudent)
//     return listStudent
//   } catch (error) {
//     console.log('error get all student => ', error)
//     return []
//   }
// }
// //get student history attend by student id
// //result result mẫu api trả về: [
// //  {
// //    "id": "c80cbc25-90df-4a94-bd50-669d6ed49a4f",
// //    "driverName": "teacher",
// //    "assistantName": "assistant",
// //    "date": "2025-04-18",
// //    "routeCode": "R002",
// //    "routeDescription": "tuyen 2",
// //    "direction": "PICK_UP",
// //    "status": "ABSENT",
// //    "checkin": null,
// //    "checkout": null,
// //    "checkpointName": "Gần cổng làng Phú Đô",
// //    "modifiedBy": ""
// //  },
// //  {
// //    "id": "b25f1d04-d432-4413-bda9-ee5320f3e7d6",
// //    "driverName": "teacher",
// //    "assistantName": "assistant",
// //    "date": "2025-04-18",
// //    "routeCode": "R002",
// //    "routeDescription": "tuyen 2",
// //    "direction": "DROP_OFF",
// //    "status": "IN_BUS",
// //    "checkin": "2025-04-18T05:23:50.000+00:00",
// //    "checkout": null,
// //    "checkpointName": "Gần cổng làng Phú Đô",
// //    "modifiedBy": "Nhận diện tự động qua camera"
// //  }
// //]
// /**
//  * status : IN_BUS, ABSENT, ATTENDED ( trên xe , vắng mặt , đã điểm danh )
//  * direction : PICK_UP, DROP_OFF ( đón , trả )
//  * check_in : thời gian lên xe ( có thể null vì chưa lên xe hoặc điểm danh vắng mặt )
//  * check_out : thời gian xuống xe ( có thể null vì chưa xuống xe hoặc điểm danh vắng mặt )
//  * những thằng nào trả về là null, trống thì hiển thị trong lịch sử điểm danh là badge trống
//  */
// // export async function getStudentHistoryStudentId(studentId: string) {
// //   try {
// //     const req = await API_SERVICES.students.get_history_by_student_id(studentId)
// //     const listStudentHistory = req.data.data || req.data
// //     console.log('2. list student history => ', listStudentHistory)
// //     return listStudentHistory
// //   } catch (error) {
// //     console.log('error get student history by student id => ', error)
// //     return []
// //   }
// // }
// // Fix the UUID conversion error by ensuring proper string formatting
// // Update the getStudentHistoryStudentId function to handle UUID properly
// export async function getStudentHistoryStudentId(studentId: string) {
//   try {
//     // Make sure studentId is properly formatted as a UUID string
//     // The error suggests the UUID string is too large, which might be a formatting issue
//     const req = await API_SERVICES.students.get_history_by_student_id(studentId.trim())
//     const listStudentHistory = req.data.data || req.data
//     console.log('2. list student history => ', listStudentHistory)
//     return listStudentHistory
//   } catch (error) {
//     console.log('error get student history by student id => ', error)
//     return []
//   }
// }
// gọi API đã cấu hình sẵn
import { API_SERVICES } from '@/api/api-services'
import type { Student, AttendanceRecord } from './types'

// Lấy danh sách HS
export async function getAllStudent(): Promise<Student[]> {
  try {
    const res = await API_SERVICES.students.list()
    return res.data?.data?.students ?? res.data?.students ?? []
  } catch (err) {
    console.error('getAllStudent ➜', err)
    return []
  }
}

/**
//  * status : IN_BUS, ABSENT, ATTENDED ( trên xe , vắng mặt , đã điểm danh )
//  * direction : PICK_UP, DROP_OFF ( đón , trả )
//  * check_in : thời gian lên xe ( có thể null vì chưa lên xe hoặc điểm danh vắng mặt )
//  * check_out : thời gian xuống xe ( có thể null vì chưa xuống xe hoặc điểm danh vắng mặt )
//  * những thằng nào trả về là null, trống thì hiển thị trong lịch sử điểm danh là badge trống
  */

// Lấy lịch sử điểm danh theo studentId
export async function getStudentHistoryStudentId(studentId: string) {
  const cleanId = studentId.trim()
  console.log('studentId gửi BE ➜', cleanId, 'length:', cleanId.length)
  try {
    const res = await API_SERVICES.students.get_history_by_student_id(encodeURIComponent(cleanId))
    return res.data?.data ?? res.data ?? []
  } catch (error) {
    console.error('getStudentHistoryStudentId ➜', error)
    return []
  }
}
