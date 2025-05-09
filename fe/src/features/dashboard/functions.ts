//url file :  fe/src/features/dashboard/functions.ts
import { API_SERVICES } from '@/api/api-services'
import { getAllStudent, getStudentHistoryStudentId } from '@/features/students/attendance/functions'
import { Student, AttendanceRecord } from '@/features/students/attendance/types'

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

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

//url file :  fe/src/features/dashboard/functions.ts

//final report
///attendance/final-report

//function get pre data for final report
//1. cần thông tin tổng quát
//- 1 biến lấy năm học dựa trên thời gian hiện tại , 1 biến lấy ngày bắt đầu của năm và ngày kết thúc của năm dựa vào biến năm học lấy được, 1 biến tổng số ngày xe hoạt động
//được tính bằng cách lấy ngày kết thúc - ngày bắt đầu - 9 ngày nghỉ lễ - tổng số ngày thứ 7 và chủ nhật trong khoảng thời gian đó.
//2. cần thông tin số lượng học sinh tham gia
//- Có api trả về từ //attendance/final-report :  // { "status": 200, "message": "Final report", "data": [ { "grade": 1, "amountOfStudentRegistered": 1, "amountOfStudentDeregistered": 0 }, { "grade": 2, "amountOfStudentRegistered": 2, "amountOfStudentDeregistered": 1 }, { "grade": 3, "amountOfStudentRegistered": 1, "amountOfStudentDeregistered": 0 }, { "grade": 4, "amountOfStudentRegistered": 2, "amountOfStudentDeregistered": 0 }, { "grade": 5, "amountOfStudentRegistered": 8, "amountOfStudentDeregistered": 0 } ] }

// Hàm lấy dữ liệu chuẩn bị cho báo cáo cuối kỳ
export async function getPreDataForFinalReport() {
  try {
    // 1. Thông tin tổng quát
    // 1.1. Xác định năm học dựa trên thời gian hiện tại
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() // 0-11 (0: Jan, 11: Dec)
    const currentYear = currentDate.getFullYear()
    // Năm học thường bắt đầu từ tháng 8 (hoặc tháng 9), kết thúc vào tháng 5 (hoặc tháng 6)
    // Nếu hiện tại trước tháng 8, năm học là năm trước - năm hiện tại
    // Nếu hiện tại từ tháng 8 trở đi, năm học là năm hiện tại - năm sau
    const schoolYear = currentMonth < 7 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`

    // 1.2. Xác định ngày bắt đầu và kết thúc của năm học
    // Giả định: Năm học bắt đầu từ 1/8 năm đầu, kết thúc 31/5 năm sau
    const startYear = currentMonth < 7 ? currentYear - 1 : currentYear
    const endYear = startYear + 1
    const startDate = new Date(startYear, 7, 1) // 1/8
    const endDate = new Date(endYear, 4, 31) // 31/5

    // 1.3. Tính tổng số ngày xe hoạt động
    // Hàm tính số ngày thứ Bảy và Chủ Nhật trong khoảng thời gian
    const countWeekends = (start: Date, end: Date) => {
      let count = 0
      const current = new Date(start)
      while (current <= end) {
        const day = current.getDay() // 0: Chủ Nhật, 6: Thứ Bảy
        if (day === 0 || day === 6) {
          count++
        }
        current.setDate(current.getDate() + 1)
      }
      return count
    }

    // Tính tổng số ngày
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const weekendDays = countWeekends(startDate, endDate)
    const holidayDays = 9 // 9 ngày nghỉ lễ
    const operatingDays = totalDays - weekendDays - holidayDays

    // 2. Lấy thông tin số lượng học sinh từ API
    const response_root = await API_SERVICES.attendance.final_report()
    const studentData = response_root.data.data // Dữ liệu học sinh theo khối lớp

    // Kiểm tra dữ liệu API
    if (!response_root.data || response_root.data.status !== 200) {
      throw new Error(response_root.data?.message || 'Lỗi từ API')
    }

    // Kiểm tra xem studentData có phải là mảng và không rỗng
    if (!Array.isArray(studentData) || studentData.length === 0) {
      throw new Error('Dữ liệu học sinh không hợp lệ hoặc rỗng')
    }

    // Trả về dữ liệu tổng hợp
    return {
      schoolYear, // Năm học (e.g., "2024-2025")
      startDate: formatDate(startDate), // Ngày bắt đầu năm học (e.g., "01/08/2024")
      endDate: formatDate(endDate), // Ngày kết thúc năm học (e.g., "31/05/2025")
      operatingDays, // Tổng số ngày xe hoạt động
      studentData, // Dữ liệu học sinh từ API
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu báo cáo:', error)
    throw error // Ném lỗi để xử lý ở nơi gọi hàm
  }
}

// Số lượng xe buýt hoạt động  thuộc final report
//{ "status": 200, "message": "Bus report", "data": [ { "licensePlate": "30A-921.12", "driverName": "Bùi Mạnh Toàn Tình", "assistantName": "Lê Văn Long", "amountOfRide": 66, "maxCapacity": 30 }, { "licensePlate": "29H-678.66", "driverName": "driver1", "assistantName": "Phạm Khánh Toàn", "amountOfRide": 4, "maxCapacity": 30 } ] }
export async function getBusReportForFinalReport() {
  try {
    const response = await API_SERVICES.attendance.bus_report()
    return response.data.data
  } catch (error) {
    console.error('Error fetching bus report:', error)
    throw new Error('Failed to fetch bus report')
  }
}

// Tổng số tuyến xe đã vận hành thuộc final report
// /{ "status": 200, "message": "Route report", "data": [ { "routeName": "Tuyến đường số 5", "path": "Gần cổng làng Phú Đô -> Cổng làng Phú Đô -> Đối diện Trường THCS Yên Hòa - 282 Trung Kính -> Đối diện UBND Phường Mỗ Lao -> Trường Liên cấp TH & THCS Ngôi Sao Hà Nội", "amountOfStudent": 12, "amountOfTrip": 66 } ] }
export async function getRouteReportForFinalReport() {
  try {
    const response = await API_SERVICES.attendance.route_report()
    return response.data.data
  } catch (error) {
    console.error('Error fetching route report:', error)
    throw new Error('Failed to fetch route report')
  }
}

//Báo cáo điểm danh học sinh - sheet 2
// đầu tiên lấy danh sách học sinh trong hệ thống
//sau đó lấy danh sách id của chúng
//sau đó dự vào id để gọi api lấy ra lịch sử điểm danh, sử dụng hệ thống
//sau đó gọi hàm tính toán : tổng số lượt đi , tổng số lượt về (PICK UP , DROP OFF)
// Hàm lấy báo cáo điểm danh học sinh
// Hàm lấy báo cáo điểm danh học sinh
// Hàm lấy báo cáo điểm danh học sinh
export async function getAttendanceReport(): Promise<{
  report: {
    stt: number
    studentName: string
    className: string
    pickUpCount: number
    dropOffCount: number
    totalTrips: number
    note: string
  }[]
  totalStudents: number
  totalPickUps: number
  totalDropOffs: number
}> {
  try {
    // 1. Lấy danh sách học sinh trong hệ thống
    const students = await getAllStudent()
    if (students.length === 0) {
      throw new Error('Không có học sinh nào trong hệ thống')
    }

    // 2. Lấy danh sách ID của học sinh
    const studentIds = students.map((student) => student.id)

    // 3. Lấy lịch sử điểm danh cho từng học sinh
    const attendancePromises = studentIds.map(async (studentId) => {
      const history = await getStudentHistoryStudentId(studentId)
      return { studentId, history }
    })

    const attendanceResults = await Promise.all(attendancePromises)

    // 4. Tính toán báo cáo
    const report = attendanceResults
      .map(({ studentId, history }, index) => {
        const student = students.find((s) => s.id === studentId)
        if (!student) {
          console.warn(`Không tìm thấy thông tin học sinh với ID: ${studentId}`)
          return null
        }

        // Lọc các bản ghi điểm danh thành công
        const attendedRecords = history.filter((record: AttendanceRecord) => record.status === 'ATTENDED')

        // Tính số lượt đi và về
        const pickUpCount = attendedRecords.filter((record: AttendanceRecord) => record.direction === 'PICK_UP').length
        const dropOffCount = attendedRecords.filter((record: AttendanceRecord) => record.direction === 'DROP_OFF').length
        const totalTrips = pickUpCount + dropOffCount
        return {
          stt: index + 1,
          studentName: student.name,
          className: student.className || 'Chưa có lớp',
          pickUpCount,
          dropOffCount,
          totalTrips,
          note: '',
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    // Tính tổng
    const totalPickUps = report.reduce((sum, item) => sum + item.pickUpCount, 0)
    const totalDropOffs = report.reduce((sum, item) => sum + item.dropOffCount, 0)

    return {
      report,
      totalStudents: students.length,
      totalPickUps,
      totalDropOffs,
    }
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo điểm danh:', error)
    throw error
  }
}

//chart : tổng quan điểm danh
//Attendance Rate (%) = (Số lượt điểm danh thành công / Tổng số lượt cần điểm danh) * 100 Ví dụ: Tổng số học sinh cần đi học hôm nay: 500 Mỗi học sinh có 2 lượt cần điểm danh (lên xe và xuống xe) → Tổng lượt cần điểm danh: 500 x 2 = 1000 Lượt điểm danh thành công (AI nhận diện đúng & lưu log): 950
// api : { "status": 200, "message": "Dashboard", "data": { "totalActiveStudent": 23, "totalActiveRoute": 3, "totalActiveUser": 29, "attendanceRate": [ { "percentage": null, "month": "2024-09" }, { "percentage": null, "month": "2024-10" }, { "percentage": null, "month": "2024-11" }, { "percentage": null, "month": "2024-12" }, { "percentage": null, "month": "2025-01" }, { "percentage": null, "month": "2025-02" }, { "percentage": null, "month": "2025-03" }, { "percentage": null, "month": "2025-04" }, { "percentage": 100.00, "month": "2025-05" }, { "percentage": null, "month": "2025-06" } ] } }
//tháng nào có % mà null thì cột đod có giá trị bằng 0
// Cần thêm logic để xử lý giá trị null trong attendanceRate
export async function getAttendanceRate() {
  try {
    const response = await API_SERVICES.attendance.chart_dashboard()
    const rawData = response.data.data.attendanceRate

    const processedData = rawData.map((item: { month: string; percentage: number | null }) => {
      const date = new Date(item.month + '-01') // Convert to date
      const monthName = date.toLocaleString('default', { month: 'short' }) // e.g. Jan
      return {
        name: monthName,
        rate: item.percentage ?? 0, // Convert null to 0
      }
    })

    return processedData
  } catch (error) {
    console.error('Error fetching attendance rate:', error)
    throw new Error('Failed to fetch attendance rate')
  }
}
