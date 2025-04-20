import { Status } from '@/components/mine/status'

interface RequestStatusBadgeProps {
  status: string
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  switch (status) {
    case 'PENDING':
      return <Status color='yellow'>Chờ duyệt</Status>
    case 'APPROVED':
      return <Status color='green'>Đã duyệt</Status>
    case 'REJECTED':
      return <Status color='red'>Từ chối</Status>
    case 'READ':
      return <Status color='blue'>Đã xem</Status>
    default:
      return <Status color='gray'>{status}</Status>
  }
}
