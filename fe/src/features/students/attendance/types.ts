// /src/api/types.ts
// --------------------------------------------------

/* ---------- Student & phụ huynh ---------- */

export interface ParentProfile {
  userId: string
  username: string
  name: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  dob: string // ISO‑8601: "1983-12-29"
  email: string
  avatar: string
  phone: string
  address: string
  status: 'ACTIVE' | 'INACTIVE'
  role: 'PARENT'
}

export interface Student {
  className: string | null // tên lớp, VD: "Lớp 1A"
  /* các field cơ bản */
  id: string // UUID
  rollNumber: string // mã học sinh, VD: "HS00027"
  name: string
  avatar: string
  dob: string // ISO‑8601: "2017-11-07T17:00:00.000Z"
  address: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE'

  /* liên kết phụ huynh & xe buýt */
  parentId: string | null
  parent?: ParentProfile

  busId: string | null
  busName: string | null

  /* điểm đón */
  checkpointId: string | null
  checkpointName: string
  checkpointDescription: string
}

/* ---------- Lịch sử điểm danh ---------- */

export interface AttendanceRecord {
  id: string // UUID
  date: string // "2025-04-18"
  direction: 'PICK_UP' | 'DROP_OFF' // đón / trả
  status: 'IN_BUS' | 'ABSENT' | 'ATTENDED' // trên xe / vắng / đã điểm danh

  checkin: string | null // "2025-04-18T05:23:50.000Z"
  checkout: string | null // ISO date‑time hoặc null

  routeCode: string // "R002"
  routeDescription: string // "tuyen 2"

  driverName: string
  assistantName: string

  checkpointName: string
  modifiedBy: string | null // "Nhận diện tự động qua camera"
}
