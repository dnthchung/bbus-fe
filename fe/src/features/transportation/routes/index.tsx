'use client'

import { useState, useEffect } from 'react'
import type { BusStop, Bus, Student } from '@/types/bus'
import { Loader2, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { getListCheckpoint, getBusesByCheckpointId, getStudentsByCheckpointId, getNumberOfStudentInEachCheckpoint } from '../function'
import DraggableBusRoutePlanner from './components/map/draggable-bus-route-planner'
import LeftSidebar from './components/panel/left-panel'
import RightPanel from './components/panel/right-panel'

export default function TransportationRouteManagement() {
  const { toast } = useToast()
  const [checkpoints, setCheckpoints] = useState<BusStop[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<BusStop | null>(null)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([])
  const [checkpointStudents, setCheckpointStudents] = useState<Student[]>([])
  const [busRoutesGeometry, setBusRoutesGeometry] = useState<{ [busId: string]: [number, number][] }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBuses, setIsLoadingBuses] = useState(false)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch all checkpoints on initial load
  useEffect(() => {
    const fetchCheckpoints = async () => {
      setIsLoading(true)
      try {
        const checkpointsData = await getListCheckpoint()

        // Transform API response to match our BusStop type
        const transformedCheckpoints: BusStop[] = await Promise.all(
          checkpointsData.map(async (checkpoint: any) => {
            // Get student count for each checkpoint
            let studentCount = 0
            try {
              studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
            } catch (error) {
              console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
            }

            return {
              id: checkpoint.id,
              name: checkpoint.name,
              description: checkpoint.description,
              lat: Number.parseFloat(checkpoint.latitude),
              lng: Number.parseFloat(checkpoint.longitude),
              status: checkpoint.status,
              studentCount,
            }
          })
        )

        setCheckpoints(transformedCheckpoints)
      } catch (error) {
        console.error('Error fetching checkpoints:', error)
        toast({
          title: 'Error',
          description: 'Failed to load checkpoints data',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCheckpoints()
  }, [toast])

  // Fetch buses and students when a checkpoint is selected
  useEffect(() => {
    if (!selectedCheckpoint) {
      setFilteredBuses([])
      setCheckpointStudents([])
      return
    }

    const fetchBusesAndStudents = async () => {
      setIsLoadingBuses(true)
      setIsLoadingStudents(true)

      // Fetch buses for the selected checkpoint
      try {
        const busesData = await getBusesByCheckpointId(selectedCheckpoint.id)

        // Transform API response to match our Bus type
        const transformedBuses: Bus[] = busesData.map((bus: any) => ({
          id: bus.id,
          name: bus.name || `Bus ${bus.id.substring(0, 6)}`,
          licensePlate: bus.licensePlate,
          driverName: bus.driverName,
          driverPhone: bus.driverPhone,
          assistantName: bus.assistantName,
          assistantPhone: bus.assistantPhone,
          capacity: 30, // Default capacity if not provided
          registeredCount: bus.amountOfStudents || 0,
          routeId: bus.routeId,
          routeCode: bus.routeCode,
          status: bus.busStatus,
          route: [], // Will be populated if needed
        }))

        setFilteredBuses(transformedBuses)
      } catch (error) {
        console.error(`Error fetching buses for checkpoint ${selectedCheckpoint.id}:`, error)
        toast({
          title: 'Error',
          description: 'Failed to load buses data',
          variant: 'destructive',
        })
        setFilteredBuses([])
      } finally {
        setIsLoadingBuses(false)
      }

      // Fetch students for the selected checkpoint
      try {
        const studentsData = await getStudentsByCheckpointId(selectedCheckpoint.id)

        // Transform API response to match our Student type
        const transformedStudents: Student[] = studentsData.map((student: any) => ({
          id: student.studentId,
          name: student.studentName,
          rollNumber: student.rollNumber,
          status: student.registered ? 'registered' : 'waiting',
          busId: student.busId,
          busName: student.busName,
        }))

        setCheckpointStudents(transformedStudents)
      } catch (error) {
        console.error(`Error fetching students for checkpoint ${selectedCheckpoint.id}:`, error)
        toast({
          title: 'Error',
          description: 'Failed to load students data',
          variant: 'destructive',
        })
        setCheckpointStudents([])
      } finally {
        setIsLoadingStudents(false)
      }
    }

    fetchBusesAndStudents()
  }, [selectedCheckpoint, toast])

  // Generate route geometry when selected bus changes
  useEffect(() => {
    if (selectedBus) {
      generateRouteGeometry(selectedBus)
    }
  }, [selectedBus])

  // Generate route geometry using OSRM
  const generateRouteGeometry = async (bus: Bus) => {
    // Skip if the bus doesn't have a route or has less than 2 stops
    if (!bus.route || bus.route.length < 2) return

    try {
      // Find the checkpoints that are in this bus's route
      const busCheckpoints = checkpoints.filter((checkpoint) => bus.route && bus.route.includes(checkpoint.id))

      if (busCheckpoints.length < 2) return

      const coordinates = busCheckpoints.map((checkpoint) => `${checkpoint.lng},${checkpoint.lat}`).join(';')

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`

      const response = await fetch(url)
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry.coordinates
        const convertedRoute = routeGeometry.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])

        setBusRoutesGeometry((prev) => ({
          ...prev,
          [bus.id]: convertedRoute,
        }))
      }
    } catch (error) {
      console.error('Error generating route:', error)
      toast({
        title: 'Route Generation Failed',
        description: 'Could not generate the route. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Register student to a bus
  const registerStudent = async (studentId: string, busId: string) => {
    if (!selectedCheckpoint) return

    setIsSaving(true)
    try {
      // In a real implementation, you would call an API to register a student to a bus
      // For now, we'll just show a success message and update the local state

      // Update the local state to reflect the change
      const updatedStudents = checkpointStudents.map((student) => {
        if (student.id === studentId) {
          const selectedBusInfo = filteredBuses.find((bus) => bus.id === busId)
          return {
            ...student,
            busId,
            busName: selectedBusInfo?.name || `Bus ${busId.substring(0, 6)}`,
            status: 'registered' as const,
          }
        }
        return student
      })

      setCheckpointStudents(updatedStudents)

      // Also update the bus's registered count
      const updatedBuses = filteredBuses.map((bus) => {
        if (bus.id === busId) {
          return {
            ...bus,
            registeredCount: (bus.registeredCount || 0) + 1,
          }
        }
        return bus
      })

      setFilteredBuses(updatedBuses)

      toast({
        title: 'Student Registered',
        description: `Student has been assigned to bus successfully`,
      })
    } catch (error) {
      console.error('Error registering student:', error)
      toast({
        title: 'Registration Failed',
        description: 'Could not register student to bus. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Update checkpoint position
  const handleUpdateCheckpoint = async (checkpointId: string, newPosition: [number, number]) => {
    setIsSaving(true)
    try {
      // In a real implementation, you would call an API to update the checkpoint position
      // For now, we'll just update the local state and show a success message

      const updatedCheckpoints = checkpoints.map((checkpoint) => {
        if (checkpoint.id === checkpointId) {
          return {
            ...checkpoint,
            lat: newPosition[0],
            lng: newPosition[1],
          }
        }
        return checkpoint
      })

      setCheckpoints(updatedCheckpoints)

      if (selectedCheckpoint && selectedCheckpoint.id === checkpointId) {
        setSelectedCheckpoint({
          ...selectedCheckpoint,
          lat: newPosition[0],
          lng: newPosition[1],
        })
      }

      toast({
        title: 'Checkpoint Updated',
        description: 'Checkpoint position has been updated',
      })
    } catch (error) {
      console.error('Error updating checkpoint:', error)
      toast({
        title: 'Update Failed',
        description: 'Could not update checkpoint position. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Add new checkpoint
  const handleAddCheckpoint = async (position: [number, number], name: string) => {
    setIsSaving(true)
    try {
      // In a real implementation, you would call an API to create a new checkpoint
      // For now, we'll just show a success message

      toast({
        title: 'Checkpoint Added',
        description: `New checkpoint "${name}" has been created`,
      })

      // Refresh the checkpoints list
      const checkpointsData = await getListCheckpoint()

      const transformedCheckpoints: BusStop[] = await Promise.all(
        checkpointsData.map(async (checkpoint: any) => {
          let studentCount = 0
          try {
            studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
          } catch (error) {
            console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
          }

          return {
            id: checkpoint.id,
            name: checkpoint.name,
            description: checkpoint.description,
            lat: Number.parseFloat(checkpoint.latitude),
            lng: Number.parseFloat(checkpoint.longitude),
            status: checkpoint.status,
            studentCount,
          }
        })
      )

      setCheckpoints(transformedCheckpoints)
    } catch (error) {
      console.error('Error adding checkpoint:', error)
      toast({
        title: 'Add Failed',
        description: 'Could not add new checkpoint. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    try {
      // In a real implementation, you would call APIs to save all changes
      // For now, we'll just show a success message

      toast({
        title: 'Changes Saved',
        description: 'All transportation routes and assignments have been saved',
      })
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: 'Save Failed',
        description: 'Could not save changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-lg font-medium'>Loading transportation data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center gap-4'>
          <Button onClick={saveChanges} disabled={isSaving} className='gap-2'>
            {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className='mt-16'>
        <div className='flex h-[calc(100vh-64px)]'>
          <LeftSidebar checkpoints={checkpoints} onSelectCheckpoint={setSelectedCheckpoint} selectedCheckpoint={selectedCheckpoint} />
          <div className='flex h-full flex-1 flex-col overflow-hidden p-4'>
            <DraggableBusRoutePlanner checkpoints={checkpoints} onUpdateCheckpoint={handleUpdateCheckpoint} onAddCheckpoint={handleAddCheckpoint} selectedBusId={selectedBus?.id} selectedBus={selectedBus} routeGeometry={selectedBus ? busRoutesGeometry[selectedBus.id] : undefined} />
          </div>
          <RightPanel buses={filteredBuses} students={checkpointStudents} selectedCheckpoint={selectedCheckpoint} onRegisterStudent={registerStudent} onSelectBus={setSelectedBus} selectedBus={selectedBus} isLoadingBuses={isLoadingBuses} isLoadingStudents={isLoadingStudents} />
        </div>
      </div>
    </>
  )
}
