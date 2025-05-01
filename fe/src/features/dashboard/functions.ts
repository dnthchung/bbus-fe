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

//lấy thời gian mở đơn

//đổi thời gian năm học hiện tại

//đổi thời gian mở đơn
