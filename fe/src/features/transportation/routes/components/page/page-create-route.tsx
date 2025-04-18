'use client'

import { useState, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, MapPin, Trash2, ArrowUp, ArrowDown, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
// Import UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { createRoute } from '@/features/transportation/function'
import { getListCheckpoint, getNumberOfStudentInEachCheckpoint } from './checkpoint-service'
// Import Leaflet map component
import LeafletMap from './leaflet-map'

// Types
interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: string
  longitude: string
  status: string
  studentCount?: number
}

interface RouteFormValues {
  description: string
  periodStart: string
  periodEnd: string
}

// Schema
const routeFormSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  periodStart: z.string().min(1, 'Start date is required'),
  periodEnd: z.string().min(1, 'End date is required'),
})

export default function PageCreateRoute() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCheckpoints, setSelectedCheckpoints] = useState<Checkpoint[]>([])
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Form
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      description: '',
      periodStart: format(new Date(), 'yyyy-MM-dd'),
      periodEnd: format(new Date(new Date().setMonth(new Date().getMonth() + 9)), 'yyyy-MM-dd'),
    },
  })

  // Fetch checkpoints
  useEffect(() => {
    const loadCheckpoints = async () => {
      try {
        setLoading(true)
        const data = await getListCheckpoint()

        // Fetch student count for each checkpoint
        const checkpointsWithStudentCount = await Promise.all(
          data.map(async (checkpoint: Checkpoint) => {
            try {
              const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
              return { ...checkpoint, studentCount }
            } catch (error) {
              console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
              return { ...checkpoint, studentCount: 0 }
            }
          })
        )

        setCheckpoints(checkpointsWithStudentCount)
      } catch (error) {
        console.error('Failed to fetch checkpoints:', error)
        toast({
          title: 'Error',
          description: 'Failed to load checkpoints. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadCheckpoints()
  }, [toast])

  // Filter checkpoints based on search query
  const filteredCheckpoints = useMemo(() => {
    if (!searchQuery.trim()) return checkpoints

    const query = searchQuery.toLowerCase()
    return checkpoints.filter((cp) => cp.name.toLowerCase().includes(query) || cp.description.toLowerCase().includes(query))
  }, [checkpoints, searchQuery])

  // Add checkpoint to route
  const addCheckpoint = (checkpoint: Checkpoint) => {
    if (!selectedCheckpoints.some((cp) => cp.id === checkpoint.id)) {
      setSelectedCheckpoints((prev) => [...prev, checkpoint])
      setOpen(false)
    } else {
      toast({
        title: 'Checkpoint already added',
        description: 'This checkpoint is already in the route',
        variant: 'default',
      })
    }
  }

  // Remove checkpoint from route
  const removeCheckpoint = (index: number) => {
    setSelectedCheckpoints((prev) => prev.filter((_, i) => i !== index))
  }

  // Move checkpoint up in order
  const moveCheckpointUp = (index: number) => {
    if (index === 0) return

    setSelectedCheckpoints((prev) => {
      const newOrder = [...prev]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index - 1]
      newOrder[index - 1] = temp
      return newOrder
    })
  }

  // Move checkpoint down in order
  const moveCheckpointDown = (index: number) => {
    if (index === selectedCheckpoints.length - 1) return

    setSelectedCheckpoints((prev) => {
      const newOrder = [...prev]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index + 1]
      newOrder[index + 1] = temp
      return newOrder
    })
  }

  // Form submission
  const onSubmit = async (values: RouteFormValues) => {
    if (selectedCheckpoints.length < 2) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least 2 checkpoints for the route',
        variant: 'deny',
      })
      return
    }

    // Prepare data for submission
    const path = selectedCheckpoints.map((cp) => cp.id).join(' ')

    const payload = {
      path,
      description: values.description,
      periodStart: values.periodStart,
      periodEnd: values.periodEnd,
    }

    // console.log('Submitting route:', payload)

    try {
      //call api to create route
      await createRoute(payload)

      toast({
        title: 'Route Created',
        description: 'The bus route has been created successfully',
        variant: 'success',
      })

      // Reset form after successful creation
      form.reset()
      setSelectedCheckpoints([])
    } catch (error) {
      //   console.error('Error creating route:', error)
      throw error
    }
  }

  return (
    <>
      {/* -------- Header -------- */}
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* -------- Main -------- */}
      <div className='container mx-auto mt-20 max-w-7xl'>
        <div className='flex flex-col space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Create Bus Route</h1>
            <p className='text-muted-foreground'>Create a new bus route by selecting checkpoints and setting route details</p>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Checkpoint Selection */}
            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>Checkpoints</CardTitle>
                <CardDescription>Search and select checkpoints to add to your route</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='space-y-2'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className='h-10 w-full' />
                    ))}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {/* Autocomplete/Typeahead Search */}
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
                          <div className='flex items-center'>
                            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                            <span className='text-muted-foreground'>Search for a checkpoint...</span>
                          </div>
                          <div className={open ? 'rotate-180' : ''}>▼</div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-[300px] p-0' align='start'>
                        <Command>
                          <CommandInput placeholder='Search checkpoints...' />
                          <CommandList>
                            <CommandEmpty>No checkpoints found.</CommandEmpty>
                            <CommandGroup heading='Checkpoints'>
                              {checkpoints.map((checkpoint) => (
                                <CommandItem key={checkpoint.id} value={checkpoint.name} onSelect={() => addCheckpoint(checkpoint)}>
                                  <div className='flex w-full flex-col'>
                                    <div className='flex items-center justify-between'>
                                      <span>{checkpoint.name}</span>
                                      <Badge variant='outline' className='ml-2'>
                                        {checkpoint.studentCount || 0} students
                                      </Badge>
                                    </div>
                                    <span className='truncate text-xs text-muted-foreground'>{checkpoint.description}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Selected Checkpoints */}
                    <div>
                      <div className='mb-2 flex items-center justify-between'>
                        <h3 className='text-sm font-medium'>Selected Checkpoints ({selectedCheckpoints.length})</h3>
                        {selectedCheckpoints.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='flex items-center text-xs text-muted-foreground'>
                                  <Info className='mr-1 h-3 w-3' />
                                  <span>Route order matters</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  The order of checkpoints determines the bus route path.
                                  <br />
                                  Use the arrows to reorder checkpoints.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      {selectedCheckpoints.length === 0 ? (
                        <div className='flex flex-col items-center justify-center rounded-md border p-6 text-center text-muted-foreground'>
                          <MapPin className='mb-2 h-8 w-8 opacity-50' />
                          <p>No checkpoints selected yet</p>
                          <p className='mt-1 text-xs'>Search and select checkpoints to create your route</p>
                        </div>
                      ) : (
                        <ScrollArea className='h-[400px] rounded-md border p-2'>
                          <div className='space-y-2'>
                            {selectedCheckpoints.map((checkpoint, index) => (
                              <div key={checkpoint.id} className='flex items-center justify-between rounded-md border bg-muted/20 p-2'>
                                <div className='flex items-center gap-2'>
                                  <Badge variant='outline' className='flex h-6 w-6 items-center justify-center rounded-full p-0'>
                                    {index + 1}
                                  </Badge>
                                  <div className='min-w-0 flex-1'>
                                    <p className='truncate font-medium'>{checkpoint.name}</p>
                                    <p className='truncate text-xs text-muted-foreground'>{checkpoint.description}</p>
                                  </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <Button type='button' size='icon' variant='ghost' className='h-7 w-7' onClick={() => moveCheckpointUp(index)} disabled={index === 0}>
                                    <ArrowUp className='h-4 w-4' />
                                  </Button>
                                  <Button type='button' size='icon' variant='ghost' className='h-7 w-7' onClick={() => moveCheckpointDown(index)} disabled={index === selectedCheckpoints.length - 1}>
                                    <ArrowDown className='h-4 w-4' />
                                  </Button>
                                  <Button type='button' size='icon' variant='ghost' className='h-7 w-7 text-destructive hover:text-destructive' onClick={() => removeCheckpoint(index)}>
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Route Preview and Form */}
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
                <CardDescription>Preview your route and set route details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Map Preview */}
                    <div className='relative h-[400px] overflow-hidden rounded-md border'>
                      <LeafletMap
                        checkpoints={selectedCheckpoints.map((cp) => ({
                          ...cp,
                          latitude: Number.parseFloat(cp.latitude),
                          longitude: Number.parseFloat(cp.longitude),
                        }))}
                      />
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder='Enter route description' className='resize-none' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='grid grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='periodStart'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type='date' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='periodEnd'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type='date' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type='submit' className='w-full' disabled={selectedCheckpoints.length < 2}>
                      Create Route
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
