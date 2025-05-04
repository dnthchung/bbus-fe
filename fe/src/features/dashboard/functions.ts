//url file :  fe/src/features/dashboard/functions.ts
import { API_SERVICES } from '@/api/api-services'

//tạo thời gian năm học mới
export default async function createAcademicYear(name: string, startDate: string, endDate: string) {
  try {
    //call api
    await API_SERVICES.event.create_event({
      name: name,
      start: startDate,
      end: endDate,
    })
  } catch (error) {
    throw new Error('Failed to create academic year')
  }
}

//tạo thời gian mở đơn
export async function createEvent(name: string, startDate: string, endDate: string) {
  try {
    //call api
    await API_SERVICES.event.create_event({
      name: name,
      start: startDate,
      end: endDate,
    })
  } catch (error) {
    throw new Error('Failed to create event')
  }
}

//lấy thời gian năm học hiện tại
export async function getCurrentAcademicYear() {
  try {
    const response = await API_SERVICES.event.lay_tg_nam_hoc_hien_tai()
    return response.data
  } catch (error) {
    throw new Error('Failed to get current academic year')
  }
}

//{ "status": 200, "message": "count total students", "data": 53 }
export async function dem_so_hoc_sinh() {
  try {
    const response = await API_SERVICES.dashboard.dem_so_hoc_sinh()
    return response.data.data
  } catch (error) {
    console.error('Error fetching student count:', error)
  }
}

//{ "status": 200, "message": "Request statistics", "data": { "pendingRequests": 0, "totalRequests": 3 } }
//đếm yêu cầu pending/tổng số yêu cầu
export async function dem_so_yeu_cau() {
  try {
    const response = await API_SERVICES.dashboard.dem_so_yeu_cau()
    return response.data.data
  } catch (error) {
    throw new Error('Failed to get request count')
  }
}
//{ "status": 200, "message": "User account statistics", "data": { "inactiveUsers": 0, "activeUsers": 61, "totalUsers": 61 } }
export async function thong_so_account() {
  try {
    const response = await API_SERVICES.dashboard.thong_so_account()
    return response.data.data.totalUsers
  } catch (error) {
    throw new Error('Failed to get account statistics')
  }
}

//{ "status": 200, "message": "Count total bus routes", "data": 2 }
export async function tong_tuyen_duong() {
  try {
    const response = await API_SERVICES.dashboard.tong_tuyen_duong()
    return response.data.data
  } catch (error) {
    throw new Error('Failed to get total routes')
  }
}

//final report
///attendance/final-report

//function get pre data for final report
//1. cần thông tin tổng quát
//- 1 biến lấy năm học dựa trên thời gian hiện tại , 1 biến lấy ngày bắt đầu của năm và ngày kết thúc của năm dựa vào biến năm học lấy được, 1 biến tổng số ngày xe hoạt động
//được tính bằng cách lấy ngày kết thúc - ngày bắt đầu - 9 ngày nghỉ lễ - tổng số ngày thứ 7 và chủ nhật trong khoảng thời gian đó.
//2. cần thông tin số lượng học sinh tham gia
//- Có api trả về từ //attendance/final-report :  // { "status": 200, "message": "Final report", "data": [ { "grade": 1, "amountOfStudentRegistered": 1, "amountOfStudentDeregistered": 0 }, { "grade": 2, "amountOfStudentRegistered": 2, "amountOfStudentDeregistered": 1 }, { "grade": 3, "amountOfStudentRegistered": 1, "amountOfStudentDeregistered": 0 }, { "grade": 4, "amountOfStudentRegistered": 2, "amountOfStudentDeregistered": 0 }, { "grade": 5, "amountOfStudentRegistered": 8, "amountOfStudentDeregistered": 0 } ] }

export async function getPreDataForFinalReport() {
  try {
  } catch (error) {}
}
