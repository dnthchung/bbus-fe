export interface BusStop {
  id: string
  name: string
  description?: string
  lat: number
  lng: number
  studentCount: number
  status?: string
  buses?: string[] // Optional array of bus IDs that pass through this stop
}

export interface Bus {
  id: string
  name: string
  licensePlate?: string
  driverName?: string
  driverPhone?: string
  assistantName?: string
  assistantPhone?: string
  capacity: number
  registeredCount: number
  routeId?: string
  routeCode?: string
  status?: string
  route?: string[] // Array of checkpoint IDs
}

export interface Student {
  id: string
  name: string
  rollNumber?: string
  status: 'registered' | 'waiting'
  busId?: string
  busName?: string
}
