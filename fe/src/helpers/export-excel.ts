import { faker } from '@faker-js/faker'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export function exportYearReportExcel() {
  const wb = XLSX.utils.book_new()

  // 1. Sheet: Báo cáo tổng kết năm học
  const yearSummary = [['1. Thông tin tổng quát'], ['Năm học', '2024-2025'], ['Ngày bắt đầu', '05/09/2024'], ['Ngày kết thúc', '25/05/2025'], ['Tổng số ngày xe hoạt động', `${faker.number.int({ min: 100, max: 180 })} ngày`], [], ['2. Số lượng học sinh tham gia'], ['STT', 'Khối lớp', 'Tổng đăng ký', 'Số hs nghỉ trong năm', 'Ghi chú'], ['1', 'Lớp 1', 40, 1, ''], ['2', 'Lớp 2', 38, 0, ''], ['3', 'Lớp 3', 42, 0, ''], ['4', 'Lớp 4', 35, 0, ''], ['5', 'Lớp 5', 36, 1, ''], ['', 'Tổng cộng', 191, 2, '']]
  const ws1 = XLSX.utils.aoa_to_sheet(yearSummary)
  XLSX.utils.book_append_sheet(wb, ws1, 'Tổng kết năm học')

  // 2. Sheet: Hoạt động xe buýt
  const busActivity = [
    ['STT', 'Biển số xe', 'Tài xế chính', 'Phụ xe', 'Tổng chuyến', 'Ghi chú'],
    ['1', '29A-12345', faker.person.fullName(), faker.person.fullName(), '320 chuyến', 'Xe 45 chỗ'],
    ['2', '29B-67890', faker.person.fullName(), faker.person.fullName(), '310 chuyến', 'Xe 29 chỗ'],
    ['', '', '', '', '630 chuyến', ''],
  ]
  const ws2 = XLSX.utils.aoa_to_sheet(busActivity)
  XLSX.utils.book_append_sheet(wb, ws2, 'Hoạt động xe buýt')

  // 3. Sheet: Tuyến xe đã chạy
  const routeSummary = [
    ['STT', 'Tuyến xe', 'Các điểm đón', 'Số HS phục vụ', 'Tổng chuyến', 'Ghi chú'],
    ['1', 'Tuyến 1: A -> Trường', 'Điểm 1, 2, 3', 30, '300 chuyến', ''],
    ['2', 'Tuyến 2: B -> Trường', 'Điểm 4, 5, 6', 28, '310 chuyến', ''],
    ['', '', '', 'Tổng học sinh', 'Tổng chuyến', ''],
  ]
  const ws3 = XLSX.utils.aoa_to_sheet(routeSummary)
  XLSX.utils.book_append_sheet(wb, ws3, 'Tuyến xe đã chạy')

  // Xuất file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'baocao-tongket-namhoc.xlsx')
}
