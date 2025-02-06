// export function extractUsername(email: string): string {
//   return email.split('@')[0] || 'Unknown'
// }

// src/utils/extract-user-name.ts
/**
 * Trả về phần username (phần trước ký tự "@") của email.
 * Nếu email không hợp lệ hoặc rỗng, trả về chuỗi rỗng.
 */
export function extractUsername(email: string): string {
  if (!email) return ''
  return email.split('@')[0]
}
