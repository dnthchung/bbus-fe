// src/features/dashboard/fake-data.ts
import { faker } from '@faker-js/faker'

// KPI dữ liệu
export const dashboardData = {
  totalStudents: 1102,
  activeStudents: faker.number.int({ min: 800, max: 1102 }),
  totalBuses: 186,
  activeBuses: faker.number.int({ min: 100, max: 186 }),
  totalAccounts: faker.number.int({ min: 2500, max: 4000 }),
  attendanceRateThisMonth: faker.number.float({ min: 90, max: 99, fractionDigits: 1 }),
  attendanceRateLastMonth: faker.number.float({ min: 85, max: 95, fractionDigits: 1 }),
}

// Attendance theo tháng
export const attendanceRateByMonth = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'].map((month) => ({
  name: month,
  rate: faker.number.float({ min: 70, max: 99, fractionDigits: 1 }),
  diff: faker.number.float({ min: -5, max: 5, fractionDigits: 1 }),
}))

// src/features/dashboard/fake-data.ts
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
