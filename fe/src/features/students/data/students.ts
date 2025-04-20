//path : fe/src/features/students/data/students.ts
import { API_SERVICES } from '@/api/api-services'
import { studentListSchema, Student } from './schema'

/**
 * Gọi API lấy danh sách học sinh, parse bằng Zod, trả về mảng Student.
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const response = await API_SERVICES.students.list()
    const rawData = response.data
    const rawStudents = rawData?.data?.students
    if (!rawStudents) {
      return []
    }
    const parsedStudents = studentListSchema.parse(rawStudents)
    return parsedStudents
  } catch (error) {
    console.error('Error getAllStudents in students.ts:', error)
    throw error
  }
}

export async function getStudentById(studentId: string): Promise<Student> {
  try {
    const response = await API_SERVICES.students.getOne(studentId)
    const rawData = response.data
    const studentDetails = rawData?.data
    if (!studentDetails) {
      throw new Error('Student not found')
    }
    return studentDetails
  } catch (error) {
    console.error(`Error get student details by id ${studentId} in students.ts:`, error)
    throw error
  }
}
