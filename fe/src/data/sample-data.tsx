//path : fe/src/data/sample-data.tsx
import type { BusStop, Bus, Student } from '@/types/bus'

// Sample data for bus stops | bus stop is checkpoint
export const busStops: BusStop[] = [
  {
    id: 1,
    name: 'Điểm đón xe buýt gần Bến xe Mỹ Đình',
    lat: 21.033781,
    lng: 105.782362,
    studentCount: 15,
  },
  {
    id: 2,
    name: 'Đại học Quốc gia',
    lat: 21.037263,
    lng: 105.782362,
    studentCount: 22,
  },
  {
    id: 3,
    name: 'Đại học Bách Khoa',
    lat: 21.0045,
    lng: 105.843888,
    studentCount: 18,
  },
  {
    id: 4,
    name: 'Hồ Hoàn Kiếm',
    lat: 21.028511,
    lng: 105.854203,
    studentCount: 10,
  },
  {
    id: 5,
    name: 'Công viên Thống Nhất',
    lat: 21.017111,
    lng: 105.84745,
    studentCount: 30,
  },
  {
    id: 6,
    name: 'Bến xe Giáp Bát',
    lat: 20.995568,
    lng: 105.841293,
    studentCount: 12,
  },
]

// Sample data for buses
export const buses: Bus[] = [
  {
    id: 1,
    capacity: 30,
    registeredCount: 25,
    route: [busStops[0], busStops[1], busStops[2]],
  },
  {
    id: 2,
    capacity: 30,
    registeredCount: 18,
    route: [busStops[1], busStops[3], busStops[4]],
  },
  {
    id: 3,
    capacity: 30,
    registeredCount: 22,
    route: [busStops[0], busStops[2], busStops[5]],
  },
]

// Generate sample student data
export const students: Student[] = [
  // Students at stop 1
  ...Array(15)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      stopId: 1,
      busId: i < 10 ? 1 : undefined,
      status: i < 10 ? ('registered' as const) : ('waiting' as const),
    })),
  // Students at stop 2
  ...Array(22)
    .fill(0)
    .map((_, i) => ({
      id: i + 16,
      name: `Student ${i + 16}`,
      stopId: 2,
      busId: i < 15 ? 1 : undefined,
      status: i < 15 ? ('registered' as const) : ('waiting' as const),
    })),
  // Students at stop 3
  ...Array(18)
    .fill(0)
    .map((_, i) => ({
      id: i + 38,
      name: `Student ${i + 38}`,
      stopId: 3,
      busId: i < 12 ? 3 : undefined,
      status: i < 12 ? ('registered' as const) : ('waiting' as const),
    })),
  // Students at other stops
  ...Array(10)
    .fill(0)
    .map((_, i) => ({
      id: i + 56,
      name: `Student ${i + 56}`,
      stopId: 4,
      busId: i < 8 ? 2 : undefined,
      status: i < 8 ? ('registered' as const) : ('waiting' as const),
    })),
  ...Array(30)
    .fill(0)
    .map((_, i) => ({
      id: i + 66,
      name: `Student ${i + 66}`,
      stopId: 5,
      busId: i < 10 ? 2 : undefined,
      status: i < 10 ? ('registered' as const) : ('waiting' as const),
    })),
  ...Array(12)
    .fill(0)
    .map((_, i) => ({
      id: i + 96,
      name: `Student ${i + 96}`,
      stopId: 6,
      busId: i < 10 ? 3 : undefined,
      status: i < 10 ? ('registered' as const) : ('waiting' as const),
    })),
]
