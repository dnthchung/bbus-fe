//url  file : fe/src/helpers/vietnamese-plate-check.ts
/**
 * Kiểm tra xem một chuỗi có phải là biển số ô tô Việt Nam hợp lệ theo:
 *  - Không bắt đầu bằng 0
 *  - Bắt buộc có dấu '-'
 *  - Đúng định dạng: tỉnh (2 chữ số), sê-ri (1–2 chữ cái), '-', 3 số, '.', 2 số
 * @param plate Chuỗi biển số (ví dụ: "30A-123.45")
 * @returns true nếu hợp lệ, false nếu không
 */
export function isValidVietnamLicensePlate(plate: string): boolean {
  const regex = /^[1-9]\d[A-Z]{1,2}-\d{3}\.\d{2}$/
  return regex.test(plate)
}

/**
 * Kiểm tra từng thành phần của biển số xe Việt Nam
 * @param plate Chuỗi biển số cần kiểm tra
 * @returns Đối tượng chứa kết quả kiểm tra từng thành phần
 */
export function validateVietnamLicensePlateParts(plate: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!plate) {
    errors.push('Biển số không được để trống')
    return { isValid: false, errors }
  }

  // Kiểm tra không bắt đầu bằng số 0
  if (plate.startsWith('0')) {
    errors.push('Biển số không được bắt đầu bằng số 0')
  }

  // Kiểm tra có dấu '-'
  if (!plate.includes('-')) {
    errors.push('Biển số phải chứa dấu "-"')
  }

  // Kiểm tra định dạng tổng thể
  const regex = /^[1-9]\d[A-Z]{1,2}-\d{3}\.\d{2}$/
  if (!regex.test(plate)) {
    errors.push('Định dạng biển số không hợp lệ (phải theo mẫu: 30A-123.45)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
