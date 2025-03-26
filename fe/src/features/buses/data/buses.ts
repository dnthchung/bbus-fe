//path : fe/src/features/buses/data/buses.ts
// Fake data for buses
import { faker } from '@faker-js/faker'
import { Bus } from './schema'

// Tạo một mảng gồm 20 xe buýt giả mạo
export const buses: Bus[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  licensePlate: faker.vehicle.vrm(), // Biển số xe
  name: `Bus ${faker.number.int({ min: 1, max: 999 })}`, // Tên xe
  driverId: faker.string.uuid(), // ID tài xế
  driverName: faker.person.fullName(), // Tên tài xế
  route: `Route ${faker.location.city()} - ${faker.location.city()}`, // Tuyến đường
  espId: faker.string.alphanumeric(10), // ID ESP
  cameraFacesluice: faker.string.alphanumeric(10), // ID camera
}))

// Giả lập hàm gọi API lấy danh sách xe buýt
export const getAllBuses = async () => {
  return Promise.resolve(buses)
}
