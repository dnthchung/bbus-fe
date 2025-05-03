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
