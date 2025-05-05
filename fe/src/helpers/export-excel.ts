// src/helpers/export-excel.ts
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { getPreDataForFinalReport, getBusReportForFinalReport, getRouteReportForFinalReport } from '@/features/dashboard/functions'

export async function exportYearReportExcel() {
  try {
    // const { schoolYear, startDate, endDate, operatingDays, studentData } = await getPreDataForFinalReport()

    const wb = XLSX.utils.book_new()

    // 1. Sheet: Báo cáo tổng kết năm học
    const finalData = await getPreDataForFinalReport()
    const busData = await getBusReportForFinalReport()
    const routeData = await getRouteReportForFinalReport()

    const yearSummary: any[][] = [['1. Thông tin tổng quát'], ['Năm học', finalData.schoolYear], ['Ngày bắt đầu', finalData.startDate], ['Ngày kết thúc', finalData.endDate], ['Tổng số ngày xe hoạt động', `${finalData.operatingDays} ngày`], [], ['2. Số lượng học sinh tham gia'], ['STT', 'Khối lớp', 'Tổng đăng ký', 'Số hs nghỉ trong năm', 'Ghi chú']]

    let totalRegistered = 0
    let totalDeregistered = 0
    finalData.studentData.forEach((item: any, idx: number) => {
      const gradeLabel = `Lớp ${item.grade}`
      const registered = item.amountOfStudentRegistered ?? 0
      const deregistered = item.amountOfStudentDeregistered ?? 0
      yearSummary.push([(idx + 1).toString(), gradeLabel, registered, deregistered, ''])
      totalRegistered += registered
      totalDeregistered += deregistered
    })

    yearSummary.push(['', 'Tổng cộng', totalRegistered, totalDeregistered, ''])

    // --- table dữ liệu số lượng xe buýt ---
    yearSummary.push([], ['3. Số lượng xe buýt hoạt động'], ['STT', 'Biển số xe', 'Tài xế chính', 'Phụ xe', 'Tổng chuyến', 'Ghi chú'])

    busData.forEach((bus: any, index: number) => {
      yearSummary.push([index + 1, bus.licensePlate, bus.driverName, bus.assistantName, `${bus.amountOfRide} chuyến`, `Xe ${bus.maxCapacity} chỗ`])
    })
    const totalBusTrips = busData.reduce((sum: any, bus: any) => sum + (bus.amountOfRide || 0), 0)
    yearSummary.push(['Tổng cộng', '', '', '', `${totalBusTrips} chuyến`, ''])

    // --- table Tuyến xe đã vận hành ---
    yearSummary.push([], ['4. Tổng số tuyến xe đã vận hành'], ['STT', 'Tuyến xe', 'Các điểm đón', 'Số HS phục vụ', 'Tổng chuyến', 'Ghi chú'])

    routeData.forEach((route: any, index: number) => {
      yearSummary.push([index + 1, route.routeName, route.path, route.amountOfStudent ?? 0, `${route.amountOfTrip} chuyến`, ''])
    })

    const totalStudentsOnRoutes = routeData.reduce((sum: any, route: any) => sum + (route.amountOfStudent || 0), 0)
    const totalTripsOnRoutes = routeData.reduce((sum: any, route: any) => sum + (route.amountOfTrip || 0), 0)
    yearSummary.push(['Tổng cộng', '', '', `${totalStudentsOnRoutes}`, `${totalTripsOnRoutes} chuyến`, ''])

    const ws1 = XLSX.utils.aoa_to_sheet(yearSummary)
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng kết năm học')

    // ===========================================================================================================

    // 2. Sheet: placeholder (Hoạt động xe buýt)
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['STT', 'Biển số xe', 'Tài xế chính', 'Phụ xe', 'Tổng chuyến', 'Ghi chú'],
      ['1', '29A-12345', 'Nguyễn Văn A', 'Trần Thị B', '320 chuyến', 'Xe 45 chỗ'],
      ['2', '29B-67890', 'Lê Văn C', 'Phạm Thị D', '310 chuyến', 'Xe 29 chỗ'],
      ['', '', '', '', '630 chuyến', ''],
    ])
    XLSX.utils.book_append_sheet(wb, ws2, 'Hoạt động xe buýt')

    // 3. Sheet: placeholder (Tuyến xe đã chạy)
    const ws3 = XLSX.utils.aoa_to_sheet([
      ['STT', 'Tuyến xe', 'Các điểm đón', 'Số HS phục vụ', 'Tổng chuyến', 'Ghi chú'],
      ['1', 'Tuyến 1: A -> Trường', 'Mỹ Đình 1, Điểm 2, Điểm 3', 30, '300 chuyến', ''],
      ['2', 'Tuyến 2: B -> Trường', 'Văn Quán, Nguyễn Trãi, Lê Văn Lương', 28, '310 chuyến', ''],
      ['', '', '', 'Tổng HS', 'Tổng chuyến', ''],
    ])
    XLSX.utils.book_append_sheet(wb, ws3, 'Tuyến xe đã chạy')

    // Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'baocao-tongket-namhoc.xlsx')
  } catch (error) {
    console.error('Xuất file Excel thất bại:', error)
  }
}
