export function formatVietnamTime(utcString: string | null): string {
  if (!utcString) return 'Trống'
  const date = new Date(utcString)
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  }).format(date)
}
