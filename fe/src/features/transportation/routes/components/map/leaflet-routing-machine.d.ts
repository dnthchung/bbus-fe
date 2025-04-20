declare namespace L {
  namespace Routing {
    class Control extends L.Control {
      constructor(options?: RoutingControlOptions)
      getRouter(): IRouter
      getWaypoints(): Waypoint[]
      setWaypoints(waypoints: Waypoint[]): this
      spliceWaypoints(index: number, waypointsToRemove: number, ...waypoints: Waypoint[]): Waypoint[]
      getPlan(): Plan
      getContainer(): HTMLElement
      route(): void
      on(event: string, fn: Function, context?: any): this
    }

    interface RoutingControlOptions {
      waypoints?: Waypoint[]
      router?: IRouter
      plan?: Plan
      geocoder?: any
      fitSelectedRoutes?: boolean | 'smart'
      lineOptions?: LineOptions
      routeWhileDragging?: boolean
      showAlternatives?: boolean
      altLineOptions?: LineOptions
      addWaypoints?: boolean
      createMarker?: Function
      draggableWaypoints?: boolean
      useZoomParameter?: boolean
      routeDragInterval?: number
      collapsible?: boolean
      show?: boolean
      autoRoute?: boolean
      addButtonClassName?: string
    }

    interface LineOptions {
      styles?: any[]
      extendToWaypoints?: boolean
      missingRouteTolerance?: number
    }

    interface Waypoint {
      latLng: L.LatLng
      name?: string
      options?: any
    }

    type Plan = {}

    type IRouter = {}
  }
}
