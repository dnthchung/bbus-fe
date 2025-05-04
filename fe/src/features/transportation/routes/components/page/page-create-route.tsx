'use client'

/* --------------------------------- IMPORTS -------------------------------- */
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconSearch } from '@tabler/icons-react'
import { validateCheckpointTimesWithoutStar } from '@/helpers/validate-checkpoint-times-without-star'
import { MapPin, Trash2, ArrowUp, ArrowDown, Info, Clock } from 'lucide-react'
import { API_SERVICES } from '@/api/api-services'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LimitedTextarea } from '@/components/mine/limited-textarea'
import { TimePickerDialog } from '@/components/mine/time-picker-dialog'
import { createRoute } from '@/features/transportation/function'
import { getAllCheckpointButNotInRoute } from './checkpoint-service'
import LeafletMap from './leaflet-map'

/* ------------------------------ CONSTANTS --------------------------------- */
const SCHOOL_ID = 'fdcb7b87-7cf4-4648-820e-b86ca2e4aa88'

/* ------------------------------- TYPE DEFS -------------------------------- */
interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: string
  longitude: string
  status: string
}

interface RouteFormValues {
  description: string
}

/* --------------------------- ZOD SCHEMA ----------------------------------- */
const routeFormSchema = z.object({
  description: z.string().min(3, 'Mô tả phải có ít nhất 3 ký tự.').max(3000, 'Mô tả không được vượt quá 3000 ký tự'),
})

/* =========================== MAIN COMPONENT =============================== */
export default function PageCreateRoute() {
  /* -------------------- STATE & HOOKS ----------------------------------- */
  const [checkpointTimes, setCheckpointTimes] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState<{
    index: number
    type: 'go' | 'return'
  } | null>(null)

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [schoolCheckpoint, setSchoolCheckpoint] = useState<Checkpoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCheckpoints, setSelectedCheckpoints] = useState<Checkpoint[]>([])
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: { description: '' },
  })

  /* -------------------- LOAD CHECKPOINT LIST --------------------------- */
  useEffect(() => {
    const loadCheckpoints = async () => {
      try {
        setLoading(true)
        const data = (await getAllCheckpointButNotInRoute()).filter((cp): cp is Checkpoint => !!cp && cp.status !== 'INACTIVE' && typeof cp.name === 'string' && cp.name.trim() !== '')
        setCheckpoints(data)
      } catch {
        toast({
          title: 'Thất bại',
          description: 'Không thể tải danh sách điểm dừng. Vui lòng thử lại.',
          variant: 'deny',
        })
      } finally {
        setLoading(false)
      }
    }

    const loadSchoolCheckpoint = async () => {
      try {
        const cp = await API_SERVICES.checkpoints.get_a_checkpoint_by_checkpoint_id(SCHOOL_ID)
        setSchoolCheckpoint(cp.data.data)
      } catch {
        toast({
          title: 'Không tải được Trường Ngôi Sao',
          description: 'Vui lòng thử lại sau.',
          variant: 'deny',
        })
      }
    }

    loadCheckpoints()
    loadSchoolCheckpoint()
  }, [toast])

  /* -------------------- DERIVED: checkpoint hiển thị ------------------- */
  const displayCheckpoints: Checkpoint[] = [...selectedCheckpoints, ...(schoolCheckpoint ? [schoolCheckpoint] : [])]

  /* -------------------- HANDLERS --------------------------------------- */
  const addCheckpoint = (checkpoint: Checkpoint) => {
    if (!selectedCheckpoints.some((cp) => cp.id === checkpoint.id)) {
      setSelectedCheckpoints((prev) => [...prev, checkpoint])
      setCheckpointTimes((prev) => [...prev, ''])
      setCheckpoints((prev) => prev.filter((cp) => cp.id !== checkpoint.id))
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
    const removedCheckpoint = selectedCheckpoints[index]
    setSelectedCheckpoints((prev) => prev.filter((_, i) => i !== index))
    setCheckpointTimes((prev) => prev.filter((_, i) => i !== index))
    setCheckpoints((prev) => [...prev, removedCheckpoint])
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

  /* -------------------- SUBMIT ----------------------------------------- */
  const onSubmit = async (values: RouteFormValues) => {
    // 2–5 checkpoint user‑pick
    if (selectedCheckpoints.length < 2 || selectedCheckpoints.length > 5) {
      toast({
        title: 'Lỗi xác thực',
        description: 'Vui lòng chọn ít nhất 2 điểm dừng và tối đa 5 điểm dừng.',
        variant: 'deny',
      })
      return
    }

    // Kiểm tra đủ giờ đi/về
    const emptyIndex = checkpointTimes.findIndex((t) => {
      const [go, ret] = t.split('/')
      return !go || !ret
    })
    if (emptyIndex !== -1) {
      toast({
        title: 'Thiếu thời gian',
        description: `Vui lòng chọn giờ đi và về cho điểm dừng thứ ${emptyIndex + 1}.`,
        variant: 'deny',
      })
      return
    }

    // Validate logic nâng cao
    const validation = validateCheckpointTimesWithoutStar(selectedCheckpoints, checkpointTimes)
    if (!validation.valid) {
      toast({
        title: 'Lỗi thời gian',
        description: validation.message,
        variant: 'deny',
      })
      return
    }

    // Payload KHÔNG chứa Trường Ngôi Sao
    const path = selectedCheckpoints.map((cp) => cp.id).join(' ')
    const checkpointTimeString = checkpointTimes.join(' ')
    const payload = {
      path,
      description: values.description.trim(),
      checkpointTime: checkpointTimeString,
    }

    try {
      await createRoute(payload)
      toast({
        title: 'Thành công',
        description: 'Tạo tuyến đường thành công',
        variant: 'success',
      })
      form.reset()
      setSelectedCheckpoints([])
      setCheckpointTimes([])
      const data = (await getAllCheckpointButNotInRoute()).filter((cp): cp is Checkpoint => !!cp && cp.status !== 'INACTIVE' && typeof cp.name === 'string' && cp.name.trim() !== '')
      setCheckpoints(data)
    } catch (error) {
      toast({
        title: 'Thất bại',
        description: 'Tạo tuyến đường thất bại',
        variant: 'destructive',
      })
    }
  }

  /* ========================== RENDER =================================== */
  return (
    <>
      {/* ---------- HEADER ---------- */}
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý tuyến đường</span>{' '}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/transportation/routes/list'>Danh sách tuyến đường</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tạo tuyến mới</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className='flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      {/* ---------- MAIN ---------- */}
      <Main>
        <div className='mb-4 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tạo tuyến xe bus</h2>
            <p className='text-muted-foreground'>Chọn điểm dừng và nhập thông tin để khởi tạo tuyến đường mới.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          {/* ==== PANEL TRÁI – CHỌN CHECKPOINT ==== */}
          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Danh sách điểm dừng</CardTitle>
              <CardDescription>Chọn và thêm điểm dừng vào tuyến đường của bạn</CardDescription>
            </CardHeader>

            <CardContent>
              {/* loading */}
              {loading ? (
                <div className='space-y-2'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className='h-10 w-full' />
                  ))}
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* Popover search */}
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant='outline' className='w-full justify-between'>
                        <div className='flex items-center'>
                          <IconSearch className='mr-2 h-4 w-4 opacity-50' />
                          <span className='text-muted-foreground'>Tìm kiếm điểm dừng...</span>
                        </div>
                        <div className={open ? 'rotate-180' : ''}>▼</div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[300px] p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm điểm dừng...' />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy điểm dừng nào.</CommandEmpty>
                          <CommandGroup heading='Danh sách điểm dừng'>
                            {checkpoints.map((checkpoint) => (
                              <CommandItem key={checkpoint.id} value={checkpoint.name ?? 'trống'} onSelect={() => addCheckpoint(checkpoint)}>
                                <div className='flex w-full flex-col'>
                                  <div className='flex items-center justify-between'>
                                    <span className='max-w-[160px] truncate'>{checkpoint.name ?? 'Trống'}</span>
                                  </div>
                                  <span className='max-w-[210px] truncate text-xs text-muted-foreground'>{checkpoint.description ?? 'Không có mô tả'}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Selected list */}
                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <h3 className='text-sm font-medium'>Điểm dừng đã chọn ({displayCheckpoints.length})</h3>

                      {displayCheckpoints.length > 0 && (
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

                    {displayCheckpoints.length === 0 ? (
                      <div className='flex flex-col items-center justify-center rounded-md border p-6 text-center text-muted-foreground'>
                        <MapPin className='mb-2 h-8 w-8 opacity-50' />
                        <p>Chưa có điểm dừng được chọn</p>
                        <p className='mt-1 text-xs'>Tìm và chọn điểm dừng để tạo tuyến</p>
                      </div>
                    ) : (
                      <ScrollArea className='h-[400px] rounded-md border p-2'>
                        <div className='space-y-2'>
                          {displayCheckpoints.map((checkpoint, index) => {
                            const isSchool = checkpoint.id === SCHOOL_ID
                            const timePair = !isSchool && checkpointTimes[index] ? checkpointTimes[index] : ''
                            return (
                              <div key={checkpoint.id} className='flex items-center justify-between rounded-md border bg-muted/20 p-2'>
                                {/* Info */}
                                <div className='flex items-center gap-2'>
                                  <Badge variant='outline' className='flex h-6 w-6 items-center justify-center rounded-full p-0'>
                                    {index + 1}
                                  </Badge>
                                  <div className='min-w-0 flex-1'>
                                    <p className='truncate font-medium'>
                                      {checkpoint.name}
                                      {isSchool && ' (Trường Ngôi Sao)'}
                                    </p>
                                    <p className='truncate text-xs text-muted-foreground'>{checkpoint.description}</p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className='flex items-center justify-end gap-1'>
                                  {/* Time buttons (ẩn nếu school) */}
                                  {!isSchool && (
                                    <div className='item mt-1 flex gap-1'>
                                      <Button
                                        size='sm'
                                        variant='outline'
                                        className='h-9 w-24 justify-between rounded-md border border-input bg-background px-3 text-left font-normal hover:bg-muted'
                                        onClick={() =>
                                          setOpenDialog({
                                            index,
                                            type: 'go',
                                          })
                                        }
                                      >
                                        {timePair.split('/')[0] || '--:--'}
                                        <Clock className='ml-2 h-4 w-4 text-muted-foreground' />
                                      </Button>
                                      <span className='flex items-center text-xs'>-</span>
                                      <Button
                                        size='sm'
                                        variant='outline'
                                        className='h-9 w-24 justify-between rounded-md border border-input bg-background px-3 text-left font-normal hover:bg-muted'
                                        onClick={() =>
                                          setOpenDialog({
                                            index,
                                            type: 'return',
                                          })
                                        }
                                      >
                                        {timePair.split('/')[1] || '--:--'}
                                        <Clock className='ml-2 h-4 w-4 text-muted-foreground' />
                                      </Button>
                                    </div>
                                  )}

                                  {/* Up/Down/Delete (ẩn nếu school) */}
                                  {!isSchool && (
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
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ==== PANEL PHẢI – FORM + MAP ==== */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Thông tin tuyến</CardTitle>
              <CardDescription>Xem bản đồ và nhập mô tả tuyến xe bus</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  {/* MAP */}
                  <div className='relative h-[400px] overflow-hidden rounded-md border'>
                    <LeafletMap
                      checkpoints={displayCheckpoints.map((cp) => ({
                        ...cp,
                        latitude: parseFloat(cp.latitude),
                        longitude: parseFloat(cp.longitude),
                      }))}
                    />
                  </div>

                  <Separator />

                  {/* DESCRIPTION */}
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <LimitedTextarea value={field.value} onChange={field.onChange} maxLength={3000} placeholder='Nhập mô tả tuyến xe...' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SUBMIT */}
                  <Button type='submit' className='w-full' disabled={selectedCheckpoints.length < 2}>
                    Tạo tuyến xe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* DIALOG CHỌN GIỜ */}
        {openDialog && (
          <TimePickerDialog
            open={true}
            initialTime={checkpointTimes[openDialog.index]?.split('/')[openDialog.type === 'go' ? 0 : 1]}
            title={`Chọn giờ ${openDialog.type === 'go' ? 'sáng đi' : 'chiều về'}`}
            onClose={() => setOpenDialog(null)}
            onConfirm={(newTime) => {
              setCheckpointTimes((prev) => {
                const updated = [...prev]
                const [go, ret] = updated[openDialog.index]?.split('/') ?? []
                updated[openDialog.index] = openDialog.type === 'go' ? `${newTime}/${ret || ''}` : `${go || ''}/${newTime}`
                return updated
              })
            }}
          />
        )}
      </Main>
    </>
  )
}
