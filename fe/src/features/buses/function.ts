//path : fe/src/features/buses/data/buses.ts
// Fake data for buses
// path: fe/src/features/buses/data/buses.ts
import { faker } from '@faker-js/faker'
import { Bus } from '@/features/buses/schema'

// Tạo một mảng gồm 20 xe buýt giả mạo
export const buses: Bus[] = Array.from({ length: 20 }, () => {
  const status = faker.helpers.arrayElement(['ACTIVE', 'INACTIVE'])

  return {
    id: faker.string.uuid(),
    licensePlate: faker.vehicle.vrm(),
    name: `Bus ${faker.number.int({ min: 1, max: 999 })}`,
    driverId: faker.string.uuid(),
    assistantId: faker.datatype.boolean() ? faker.string.uuid() : null, // 50% có phụ tá
    routeId: faker.string.uuid(),
    espId: faker.datatype.boolean() ? faker.string.alphanumeric(10) : null,
    cameraFacesluice: faker.datatype.boolean() ? faker.string.alphanumeric(10) : null,
    status,
    amountOfStudent: faker.number.int({ min: 0, max: 30 }),
    maxCapacity: 30,
    createdAt: faker.date.past().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})

// In ra danh sách xe buýt giả lập để kiểm tra
console.log('🚌 Danh sách xe buýt giả mạo:', buses)

// Giả lập hàm gọi API lấy danh sách xe buýt
export const getAllBuses = async () => {
  return Promise.resolve(buses)
}
