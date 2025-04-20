import { create } from 'zustand'

interface AttendanceState {
  selectedStudentId: string | null
  selectStudent: (id: string) => void
}

export const useAttendanceStore = create<AttendanceState>()((set) => ({
  selectedStudentId: null,
  selectStudent: (id) => set({ selectedStudentId: id }),
}))
