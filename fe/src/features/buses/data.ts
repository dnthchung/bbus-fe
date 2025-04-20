//path : fe/src/features/buses/data.ts
// Map tiếng Việt cho status
import { BusStatus } from '@/features/buses/schema'

export const statusLabels: Record<BusStatus, string> = {
  ACTIVE: 'Đang HĐ',
  INACTIVE: 'Không HĐ',
}
