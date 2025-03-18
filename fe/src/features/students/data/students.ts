//path : fe/src/features/students/data/students.ts
import { API_SERVICES } from '@/api/api-services'
import { studentListSchema, Student } from './schema'

/**
 * Gọi API lấy danh sách học sinh, parse bằng Zod, trả về mảng Student.
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    // Gọi API (đã được cấu hình token interceptor)
    const response = await API_SERVICES.students.list()
    console.log('=== response ====', response)

    // Lấy dữ liệu từ API response
    const rawData = response.data
    // console.log('rawData', rawData)

    // Lấy danh sách học sinh từ dữ liệu trả về
    const rawStudents = rawData?.data?.students
    // console.log('rawStudents', rawStudents)

    if (!rawStudents) {
      return []
    }

    // Parse & validate với Zod
    const parsedStudents = studentListSchema.parse(rawStudents)
    console.log('parsedStudents', parsedStudents)
    return parsedStudents
  } catch (error) {
    console.error('Error getAllStudents in students.ts:', error)
    // Nếu lỗi, có thể return [] hoặc throw tùy vào yêu cầu của bạn
    throw error
  }
}
