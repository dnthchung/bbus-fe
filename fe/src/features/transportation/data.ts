//path : fe/src/features/transportation/data.ts
import { CheckpointStatus } from '@/features/transportation/schema'

// Map màu sắc cho trạng thái checkpoint
export const checkpointStatuses = new Map<CheckpointStatus, string>([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVE', 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200'], // Changed to red
])

// Map trạng thái checkpoint sang tiếng Việt
export const checkpointStatusLabels = new Map<CheckpointStatus, string>([
  ['ACTIVE', 'Đang hoạt động'],
  ['INACTIVE', 'Không hoạt động'],
])
