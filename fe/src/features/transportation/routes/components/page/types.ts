export interface Checkpoint {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
}

export interface RouteFormValues {
  description: string
  periodStart: string
  periodEnd: string
}

export interface RoutePayload {
  path: string
  description: string
  periodStart: string
  periodEnd: string
}
