'use client'

import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, MapPin, Trash2, ArrowUp, ArrowDown, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
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
import { getListCheckpoint, getNumberOfStudentInEachCheckpoint, getAllCheckpointButNotInRoute } from './checkpoint-service'
import LeafletMap from './leaflet-map'

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

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      description: '',
      periodStart: format(new Date(), 'yyyy-MM-dd'),
      periodEnd: format(new Date(new Date().setMonth(new Date().getMonth() + 9)), 'yyyy-MM-dd'),
    },
  })

  useEffect(() => {
    const loadCheckpoints = async () => {
      try {
        setLoading(true)
        // const data = await getAllCheckpointButNotInRoute()
        const data = await getListCheckpoint()

        const checkpointsWithStudentCount = await Promise.all(
          data.map(async (checkpoint: Checkpoint) => {
            try {
              const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
              return { ...checkpoint, studentCount }
            } catch {
              return { ...checkpoint, studentCount: 0 }
            }
          })
        )
        setCheckpoints(checkpointsWithStudentCount)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load checkpoints. Please try again.',
          variant: 'deny',
        })
      } finally {
        setLoading(false)
      }
    }
    loadCheckpoints()
  }, [toast])

  const addCheckpoint = (checkpoint: Checkpoint) => {
    if (!selectedCheckpoints.some((cp) => cp.id === checkpoint.id)) {
      setSelectedCheckpoints((prev) => [...prev, checkpoint])
      setOpen(false)
    } else {
      toast({
        title: 'Điểm dừng đã tồn tại',
        description: 'Điểm dừng này đã được thêm vào tuyến đường',
        variant: 'deny',
      })
    }
  }

  const removeCheckpoint = (index: number) => {
    setSelectedCheckpoints((prev) => prev.filter((_, i) => i !== index))
  }

  const moveCheckpointUp = (index: number) => {
    if (index === 0) return
    setSelectedCheckpoints((prev) => {
      const newOrder = [...prev]
      ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
      return newOrder
    })
  }

  const moveCheckpointDown = (index: number) => {
    if (index === selectedCheckpoints.length - 1) return
    setSelectedCheckpoints((prev) => {
      const newOrder = [...prev]
      ;[newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]]
      return newOrder
    })
  }

  const onSubmit = async (values: RouteFormValues) => {
    if (selectedCheckpoints.length < 2) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least 2 checkpoints for the route',
        variant: 'deny',
      })
      return
    }
    const path = selectedCheckpoints.map((cp) => cp.id).join(' ')
    const payload = {
      path,
      description: values.description,
      periodStart: values.periodStart,
      periodEnd: values.periodEnd,
    }

    try {
      await createRoute(payload)
      toast({
        title: 'Route Created',
        description: 'The bus route has been created successfully',
        variant: 'success',
      })
      form.reset()
      setSelectedCheckpoints([])
    } catch (error) {
      toast({
        title: 'Create Failed',
        description: 'Something went wrong while creating the route',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tạo tuyến xe bus</h2>
            <p className='text-muted-foreground'>Chọn điểm dừng và nhập thông tin để khởi tạo tuyến đường mới.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Checkpoints Panel */}
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant='outline' className='w-full justify-between'>
                        <div className='flex items-center'>
                          <Search className='mr-2 h-4 w-4 opacity-50' />
                          <span className='text-muted-foreground'>Search for a checkpoint...</span>
                        </div>
                        <div className={open ? 'rotate-180' : ''}>▼</div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[300px] p-0'>
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
                                    <Badge variant='outline'>{checkpoint.studentCount || 0} học sinh</Badge>
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

                  {/* Selected Checkpoints List */}
                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <h3 className='text-sm font-medium'>Selected Checkpoints ({selectedCheckpoints.length})</h3>
                      {selectedCheckpoints.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className='flex items-center text-xs text-muted-foreground'>
                                <Info className='mr-1 h-3 w-3' />
                                <span>Thứ tự tuyến đường</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Thứ tự các điểm dừng sẽ quyết định lộ trình của xe bus.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {selectedCheckpoints.length === 0 ? (
                      <div className='flex flex-col items-center justify-center rounded-md border p-6 text-center text-muted-foreground'>
                        <MapPin className='mb-2 h-8 w-8 opacity-50' />
                        <p>Chưa có điểm dừng được chọn</p>
                        <p className='mt-1 text-xs'>Tìm và chọn điểm dừng để tạo tuyến</p>
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
                                <Button size='icon' variant='ghost' className='h-7 w-7' onClick={() => moveCheckpointUp(index)} disabled={index === 0}>
                                  <ArrowUp className='h-4 w-4' />
                                </Button>
                                <Button size='icon' variant='ghost' className='h-7 w-7' onClick={() => moveCheckpointDown(index)} disabled={index === selectedCheckpoints.length - 1}>
                                  <ArrowDown className='h-4 w-4' />
                                </Button>
                                <Button size='icon' variant='ghost' className='h-7 w-7 text-destructive hover:text-destructive' onClick={() => removeCheckpoint(index)}>
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

          {/* Route Form Panel */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Thông tin tuyến</CardTitle>
              <CardDescription>Xem bản đồ và nhập mô tả tuyến xe bus</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='relative h-[400px] overflow-hidden rounded-md border'>
                    <LeafletMap
                      checkpoints={selectedCheckpoints.map((cp) => ({
                        ...cp,
                        latitude: parseFloat(cp.latitude),
                        longitude: parseFloat(cp.longitude),
                      }))}
                    />
                  </div>
                  <Separator />
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea placeholder='Nhập mô tả tuyến xe...' {...field} />
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
                            <FormLabel>Ngày bắt đầu</FormLabel>
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
                            <FormLabel>Ngày kết thúc</FormLabel>
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
                    Tạo tuyến xe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
