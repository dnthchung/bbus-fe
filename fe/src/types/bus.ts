//path  :fe/src/types/bus.ts
export interface BusStop {
  id: number
  name: string
  lat: number
  lng: number
  studentCount: number
  buses?: number[] // IDs of buses that pass through this stop
}

export interface Bus {
  id: number
  capacity: number
  registeredCount: number
  route: BusStop[]
}

export interface Student {
  id: number
  name: string
  stopId: number
  busId?: number
  status: 'waiting' | 'registered'
}
