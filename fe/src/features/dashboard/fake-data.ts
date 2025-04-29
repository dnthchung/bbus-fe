import { faker } from '@faker-js/faker'

// Thống nhất dữ liệu tổng quan (KPI)
export const dashboardData = {
  totalStudents: 1102,
  activeStudents: faker.number.int({ min: 800, max: 1102 }),
  totalBuses: 186,
  activeBuses: faker.number.int({ min: 100, max: 186 }),
  totalAccounts: faker.number.int({ min: 2500, max: 4000 }),
  attendanceRateThisMonth: faker.number.float({ min: 90, max: 99, fractionDigits: 1 }),
  attendanceRateLastMonth: faker.number.float({ min: 85, max: 95, fractionDigits: 1 }),
}

// Dữ liệu điểm danh theo tháng
export const attendanceRateByMonth = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'].map((month) => ({
  name: month,
  rate: faker.number.float({ min: 70, max: 99, fractionDigits: 1 }),
  diff: faker.number.float({ min: -5, max: 5, fractionDigits: 1 }),
}))

// Dữ liệu bổ sung cho bảng điều khiển
export const extraDashboardData = {
  pendingRequests: faker.number.int({ min: 0, max: 20 }),
  pendingCheckpoints: faker.number.int({ min: 0, max: 10 }),
  routesWithLowAttendance: faker.number.int({ min: 0, max: 5 }),
  absentStudentsToday: faker.number.int({ min: 0, max: 30 }),
  busIncidentsToday: faker.number.int({ min: 0, max: 5 }),
  checkpointChangeRequests: faker.number.int({ min: 0, max: 10 }),
  driverAbsencesToday: faker.number.int({ min: 0, max: 5 }),
  totalCheckpoints: faker.number.int({ min: 50, max: 200 }),
}

// Metrics tổng hợp
export const summaryMetrics = {
  studentsOnBus: faker.number.int({ min: 100, max: 500 }),
  busesActive: faker.number.int({ min: 20, max: 50 }),
  attendanceRate: faker.number.float({ min: 80, max: 100, fractionDigits: 1 }),
  pendingRequests: faker.number.int({ min: 0, max: 15 }),
  totalStudents: faker.number.int({ min: 1000, max: 5000 }),
  totalBuses: faker.number.int({ min: 50, max: 200 }),
  activeStudents: faker.number.int({ min: 800, max: 1100 }),
  activeBuses: faker.number.int({ min: 20, max: 50 }),
  totalAccounts: faker.number.int({ min: 2500, max: 4000 }),
}

// Danh sách học sinh
export const studentList = Array.from({ length: 50 }).map(() => ({
  studentName: faker.name.fullName(),
  status: faker.helpers.arrayElement(['Đã điểm danh', 'Chưa điểm danh']),
  route: faker.helpers.arrayElement(['Tuyến 1', 'Tuyến 2', 'Tuyến 3', 'Tuyến 4']),
}))

// Biểu đồ điểm danh học sinh theo lộ trình
export const studentAttendanceByRoute = [
  { route: 'Tuyến 1', students: faker.number.int({ min: 50, max: 100 }) },
  { route: 'Tuyến 2', students: faker.number.int({ min: 50, max: 100 }) },
  { route: 'Tuyến 3', students: faker.number.int({ min: 50, max: 100 }) },
  { route: 'Tuyến 4', students: faker.number.int({ min: 50, max: 100 }) },
]

// Dữ liệu thống kê tổng quát
export const summaryData = {
  activeStudents: summaryMetrics.activeStudents,
  totalStudents: dashboardData.totalStudents,
  activeBuses: summaryMetrics.activeBuses,
  totalBuses: dashboardData.totalBuses,
  totalAccounts: summaryMetrics.totalAccounts,
  pendingRequests: summaryMetrics.pendingRequests,
  attendanceRate: dashboardData.attendanceRateThisMonth,
}
