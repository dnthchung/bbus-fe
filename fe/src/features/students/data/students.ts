//path : fe/src/features/students/data/students.ts
import { API_SERVICES } from '@/api/api-services'
import { studentListSchema, Student } from './schema'

/**
 * Gọi API lấy danh sách học sinh, parse bằng Zod, trả về mảng Student.
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const response = await API_SERVICES.students.list()
    // console.log('=== response ====', response)
    const rawData = response.data
    const rawStudents = rawData?.data?.students
    if (!rawStudents) {
      return []
    }
    // Parse & validate với Zod
    const parsedStudents = studentListSchema.parse(rawStudents)
    console.log('parsedStudents', parsedStudents)
    return parsedStudents
  } catch (error) {
    console.error('Error getAllStudents in students.ts:', error)
    throw error
  }
}
