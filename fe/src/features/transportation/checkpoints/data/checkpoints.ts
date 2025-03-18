// import { API_SERVICES } from '@/api/api-services'
// import { checkpointListSchema, Checkpoint } from './schema'
// export async function getAllUsers(): Promise<Checkpoint[]> {
//   try {
//     const response = await API_SERVICES.checkpoints.getAll()
//     const rawData = response.data
//     const rawCheckpoints = rawData?.data?.checkpoints
//     if (!rawCheckpoints) {
//       return []
//     }
//     const parsedCheckpoints = checkpointListSchema.parse(rawCheckpoints)
//     return parsedCheckpoints
//   } catch (error) {
//     console.error('Error getAllCheckpoints in checkpoints.ts:', error)
//     throw error
//   }
// }
import { faker } from '@faker-js/faker'
import { Checkpoint } from './schema'

// Toạ độ trung tâm của Hà Nội
const hanoiCenter = {
  latitude: 21.028511,
  longitude: 105.804817,
}

// Danh sách checkpoint tĩnh từ tbl_checkpoint
const staticCheckpoints: Checkpoint[] = [
  {
    id: '987ac0dd-4864-4f09-a165-caa41f52ec71',
    name: 'Bến xe Mỹ Đình',
    description: 'Điểm đón xe buýt gần Bến xe Mỹ Đình',
    latitude: '21.033781',
    longitude: '105.782362',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '8cd00406-9545-49b7-b40b-4d2bba9446f2',
    name: 'Đại học Quốc gia',
    description: 'Điểm dừng trước cổng Đại học Quốc gia',
    latitude: '21.037263',
    longitude: '105.783713',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '9018c45f-6cf2-48d5-a500-85a86ede3b2f',
    name: 'Đại học Bách Khoa',
    description: 'Điểm bắt xe tại cổng Đại học Bách Khoa',
    latitude: '21.004500',
    longitude: '105.843888',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '90cd0ab6-9bc0-42be-a996-6f47cfe2b04c',
    name: 'Hồ Hoàn Kiếm',
    description: 'Trạm xe buýt đối diện Hồ Hoàn Kiếm',
    latitude: '21.028511',
    longitude: '105.854203',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '40c64531-8e7a-4294-9e48-e41f02f57e3b',
    name: 'Công viên Thống Nhất',
    description: 'Điểm dừng xe gần Công viên Thống Nhất',
    latitude: '21.017111',
    longitude: '105.847450',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'INACTIVE',
  },
  {
    id: '9c7dc267-6dc8-49b5-9f4c-1ba317cc516d',
    name: 'Bến xe Giáp Bát',
    description: 'Trạm xe buýt ngay Bến xe Giáp Bát',
    latitude: '20.995568',
    longitude: '105.841293',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '882f1ff1-4013-4d0c-9608-acc007354e82',
    name: 'Royal City',
    description: 'Điểm đón xe trước cổng Royal City',
    latitude: '21.003653',
    longitude: '105.815528',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '90fc9498-d6c2-4fa4-9f48-266fbf8f1ebf',
    name: 'Vincom Nguyễn Chí Thanh',
    description: 'Điểm dừng xe tại Vincom Nguyễn Chí Thanh',
    latitude: '21.023300',
    longitude: '105.805900',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
  {
    id: '346b48c3-912f-456f-b2e2-4469260962e6',
    name: 'Cầu Chương Dương',
    description: 'Trạm xe buýt ở đầu cầu Chương Dương',
    latitude: '21.033028',
    longitude: '105.863672',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'INACTIVE',
  },
  {
    id: 'd13b413f-508a-406a-9fd1-6f581fd73e58',
    name: 'Sân vận động Mỹ Đình',
    description: 'Điểm bắt xe buýt gần sân vận động Mỹ Đình',
    latitude: '21.026874',
    longitude: '105.762417',
    createdAt: new Date('2025-03-06T15:17:17.012Z'),
    updatedAt: new Date('2025-03-06T15:17:17.012Z'),
    status: 'ACTIVE',
  },
]

// Hàm tạo dữ liệu điểm dừng xe buýt giả mạo tại Hà Nội
function generateHanoiCheckpoint(): Checkpoint {
  const [latitude, longitude] = faker.location.nearbyGPSCoordinate({
    origin: [hanoiCenter.latitude, hanoiCenter.longitude],
    radius: 10, // Bán kính 10 km
    isMetric: true,
  })

  return {
    id: faker.string.uuid(),
    name: faker.location.street(),
    description: faker.lorem.sentence(),
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
  }
}

// Tạo danh sách 20 điểm dừng xe buýt giả mạo tại Hà Nội
const fakeCheckpoints: Checkpoint[] = Array.from({ length: 20 }, generateHanoiCheckpoint)

// Gộp cả danh sách dữ liệu tĩnh và dữ liệu giả mạo
export const checkpoints: Checkpoint[] = [...staticCheckpoints, ...fakeCheckpoints]

// Ví dụ: In ra danh sách các điểm dừng
// console.log(checkpoints)
