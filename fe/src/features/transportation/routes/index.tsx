'use client'

// path : fe/src/features/transportation/routes/index.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { busStops as initialBusStops, buses, students } from '@/data/sample-data'
import type { BusStop, Bus, Student } from '@/types/bus'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import LeftSidebar from './components/left-sidebar'
import DraggableBusRoutePlanner from './components/map/draggable-bus-route-planner'
import RightPanel from './components/right-panel'

export default function BusRouteManagement() {
  const [busStops, setBusStops] = useState<BusStop[]>(initialBusStops)
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([])
  const [waitingStudents, setWaitingStudents] = useState<Student[]>([])

  // State to store the OSRM route geometry for each bus
  const [busRoutesGeometry, setBusRoutesGeometry] = useState<{ [busId: number]: [number, number][] }>({})

  // Function to fetch OSRM route data for a specific bus
  async function fetchOSRMRoute(bus: Bus) {
    try {
      // Get the list of [lat, lng] coordinates from bus.route
      const routePoints = bus.route.map((stop) => [stop.lat, stop.lng])

      if (routePoints.length < 2) {
        // If there aren't at least 2 points, don't call OSRM
        return
      }

      // OSRM requires a string in the format "lng,lat;lng,lat;..."
      const coordinates = routePoints.map(([lat, lng]) => `${lng},${lat}`).join(';')
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`

      const response = await axios.get(url)

      if (response.data.routes && response.data.routes.length > 0) {
        // OSRM returns geometry in [lng, lat] format
        const routeGeometry = response.data.routes[0].geometry.coordinates

        // Convert back to [lat, lng] for Leaflet Polyline
        const convertedRoute = routeGeometry.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])

        // Save to state with busId as the key
        setBusRoutesGeometry((prev) => ({
          ...prev,
          [bus.id]: convertedRoute,
        }))
      }
    } catch (error) {
      console.error('Error generating OSRM route:', error)
    }
  }

  // When a stop is selected, find buses passing through that stop and students waiting there
  useEffect(() => {
    if (selectedStop) {
      const busesPassingThrough = buses.filter((bus) => bus.route.some((stop) => stop.id === selectedStop.id))
      setFilteredBuses(busesPassingThrough)

      const studentsAtStop = students.filter((student) => student.stopId === selectedStop.id && (student.status === 'waiting' || student.status === 'registered'))
      setWaitingStudents(studentsAtStop)
    } else {
      setFilteredBuses([])
      setWaitingStudents([])
    }
  }, [selectedStop])

  // Fetch OSRM route whenever the selected bus changes
  useEffect(() => {
    if (selectedBus) {
      fetchOSRMRoute(selectedBus)
    }
  }, [selectedBus])

  // Auto-fill students into buses
  const autoFillStudents = () => {
    if (!selectedStop) return

    const updatedStudents = [...waitingStudents]
    const updatedBuses = [...filteredBuses]

    updatedBuses.forEach((bus) => {
      const registeredCount = updatedStudents.filter((s) => s.busId === bus.id && s.status === 'registered').length

      const availableSeats = bus.capacity - registeredCount

      if (availableSeats > 0) {
        const waitingStudentsForBus = updatedStudents.filter((s) => s.status === 'waiting' && !s.busId).slice(0, availableSeats)

        waitingStudentsForBus.forEach((student) => {
          const index = updatedStudents.findIndex((s) => s.id === student.id)
          if (index !== -1) {
            updatedStudents[index] = {
              ...updatedStudents[index],
              busId: bus.id,
              status: 'registered',
            }
          }
        })
      }
    })

    setWaitingStudents(updatedStudents)
  }

  // Add a stop to a bus route
  const addStopToBusRoute = (busId: number, stopId: number) => {
    const updatedBuses = [...filteredBuses]
    const busIndex = updatedBuses.findIndex((bus) => bus.id === busId)

    if (busIndex !== -1) {
      const stopToAdd = busStops.find((stop) => stop.id === stopId)
      if (stopToAdd && !updatedBuses[busIndex].route.some((stop) => stop.id === stopId)) {
        updatedBuses[busIndex].route.push(stopToAdd)
        setFilteredBuses(updatedBuses)

        // Fetch the updated OSRM route if this is the currently selected bus
        if (selectedBus && selectedBus.id === busId) {
          fetchOSRMRoute(updatedBuses[busIndex])
        }
      }
    }
  }

  // Reorder stops in a bus route
  const reorderStops = (busId: number, stopIds: number[]) => {
    const updatedBuses = [...filteredBuses]
    const busIndex = updatedBuses.findIndex((bus) => bus.id === busId)

    if (busIndex !== -1) {
      const newRoute = stopIds.map((id) => busStops.find((stop) => stop.id === id)).filter(Boolean) as BusStop[]

      updatedBuses[busIndex].route = newRoute
      setFilteredBuses(updatedBuses)

      // Fetch the updated OSRM route if this is the currently selected bus
      if (selectedBus && selectedBus.id === busId) {
        fetchOSRMRoute(updatedBuses[busIndex])
      }
    }
  }

  // Register a student to a bus
  const registerStudent = (studentId: number, busId: number) => {
    const updatedStudents = [...waitingStudents]
    const studentIndex = updatedStudents.findIndex((s) => s.id === studentId)

    if (studentIndex !== -1) {
      updatedStudents[studentIndex] = {
        ...updatedStudents[studentIndex],
        busId,
        status: 'registered',
      }
      setWaitingStudents(updatedStudents)
    }
  }

  // Update bus stop position
  const handleUpdateBusStop = (stopId: number, newPosition: [number, number]) => {
    const updatedStops = busStops.map((stop) => {
      if (stop.id === stopId) {
        return {
          ...stop,
          lat: newPosition[0],
          lng: newPosition[1],
        }
      }
      return stop
    })

    setBusStops(updatedStops)

    // Update in selectedStop if this stop is currently selected
    if (selectedStop && selectedStop.id === stopId) {
      setSelectedStop({
        ...selectedStop,
        lat: newPosition[0],
        lng: newPosition[1],
      })
    }

    // If this stop is part of the selected bus route, update the OSRM route
    if (selectedBus && selectedBus.route.some((stop) => stop.id === stopId)) {
      // Find the bus in filteredBuses to get the updated route
      const bus = filteredBuses.find((b) => b.id === selectedBus.id)
      if (bus) {
        fetchOSRMRoute(bus)
      }
    }
  }

  // Add new bus stop
  const handleAddBusStop = (position: [number, number], name: string) => {
    const newStop: BusStop = {
      id: busStops.length + 1,
      name,
      lat: position[0],
      lng: position[1],
      studentCount: 0,
    }

    setBusStops([...busStops, newStop])
  }

  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='flex h-screen'>
          <div>
            <LeftSidebar busStops={busStops} onSelectStop={setSelectedStop} selectedStop={selectedStop} />
          </div>

          <div className='flex h-[70vh] flex-1 flex-col overflow-auto p-4'>
            <DraggableBusRoutePlanner busStops={busStops} onUpdateBusStop={handleUpdateBusStop} onAddBusStop={handleAddBusStop} selectedBusId={selectedBus?.id} selectedBus={selectedBus} routeGeometry={selectedBus ? busRoutesGeometry[selectedBus.id] : undefined} />
          </div>

          <div>
            <RightPanel buses={filteredBuses} students={waitingStudents} selectedStop={selectedStop} onAutoFill={autoFillStudents} onAddStop={addStopToBusRoute} onReorderStops={reorderStops} onRegisterStudent={registerStudent} onSelectBus={setSelectedBus} selectedBus={selectedBus} />
          </div>
        </div>
      </Main>
    </>
  )
}
