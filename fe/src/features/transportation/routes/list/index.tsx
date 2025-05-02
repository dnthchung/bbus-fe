'use client'

//path : //path : fe/src/features/transportation/routes/list/index.tsx
// ============================
// Import packages, hooks, components
// ============================
import { useState } from 'react'
// import { Link, Route as EditRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Status } from '@/components/mine/status'
import { getListCheckpointByRouteId, getNumberOfStudentInEachCheckpoint } from '@/features/transportation/function'
import RoutesProvider, { useRoutes } from '@/features/transportation/routes/context/routes-context'
import RouteMap from '../components/map/route-map'
import { RoutesPrimaryButtons } from '../components/routes-primary-buttons'
import { columns } from '../components/table/routes-columns'
import { RoutesTable } from '../components/table/routes-table'

// ============================
// Interface definitions
// ============================
interface Checkpoint {
  id: string
  name: string
  description: string
  latitude: string | number
  longitude: string | number
  status: string
  studentCount?: number
  isInvalid?: boolean
}

interface Route {
  id: string
  code: string
  description: string
  path: string
  periodStart: string
  periodEnd: string
  checkpointTime?: string
}

// ============================
// Main content component
// ============================
function RoutesContent() {
  // ============================
  // Hooks and States
  // ============================
  const { routes, loading } = useRoutes()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [loadingCheckpoints, setLoadingCheckpoints] = useState(false)
  const [activeTab, setActiveTab] = useState('routes')
  const [error, setError] = useState<string | null>(null)

  // ============================
  // Function to handle route selection
  // ============================
  const handleRouteSelect = async (route: Route) => {
    try {
      setSelectedRoute(route)
      setLoadingCheckpoints(true)
      setError(null)

      // Get checkpoints for this route directly
      const checkpointsData = await getListCheckpointByRouteId(route.id)

      if (!checkpointsData || checkpointsData.length === 0) {
        setError(`Tuyến đường ${route.code} không có điểm dừng nào`)
        setCheckpoints([])
        return
      }

      // Fetch student count for each checkpoint
      const checkpointsWithStudentCount = await Promise.all(
        checkpointsData.map(async (checkpoint: Checkpoint) => {
          try {
            const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)

            // Check if coordinates are valid
            const lat = Number.parseFloat(checkpoint.latitude as string)
            const lng = Number.parseFloat(checkpoint.longitude as string)
            const isInvalid = isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0

            // Show toast for invalid checkpoints
            if (isInvalid) {
              toast({
                title: 'Cảnh báo',
                description: `Điểm dừng "${checkpoint.name}" có tọa độ không hợp lệ. Vui lòng kiểm tra lại.`,
                variant: 'deny',
              })
            }

            return {
              ...checkpoint,
              studentCount: studentCount || 0,
              isInvalid,
            }
          } catch (error) {
            console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
            return {
              ...checkpoint,
              studentCount: 0,
              isInvalid: false,
            }
          }
        })
      )

      setCheckpoints(checkpointsWithStudentCount)

      // Switch to the checkpoints tab
      setActiveTab('checkpoints')

      toast({
        title: 'Thành công',
        description: `Đã tải thông tin tuyến đường ${route.code}`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error selecting route:', error)
      setError(`Không thể tải thông tin tuyến đường ${route.code}. Vui lòng thử lại sau.`)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin tuyến đường',
        variant: 'deny',
      })
    } finally {
      setLoadingCheckpoints(false)
    }
  }

  const handleEditClick = () => {
    if (!selectedRoute) return
    navigate({
      to: `/transportation/routes/list/details/edit/${selectedRoute.id}`,
    })
  }

  const handleConfirmDelete = async () => {
    if (!selectedRoute) return

    try {
      console.log('Deleting route', selectedRoute.id)
      toast({
        title: 'Xóa thành công',
        description: `Đã xóa tuyến đường ${selectedRoute.code}.`,
        variant: 'success',
      })
      // Reset lại
      setSelectedRoute(null)
      setCheckpoints([])
      setActiveTab('routes')
    } catch (error) {
      console.error('Error deleting route:', error)
      toast({
        title: 'Xóa thất bại',
        description: 'Không thể xóa tuyến đường. Vui lòng thử lại.',
        variant: 'deny',
      })
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  // ============================
  // Render
  // ============================
  return (
    <>
      {/* Header */}
      <Header fixed className='z-50'>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý tuyến đường</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách tuyến đường</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center gap-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Main>
        {/* Page Header */}
        <div className='mb-4 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách tuyến đường</h2>
            <p className='text-muted-foreground'>Quản lý thông tin tuyến đường trên hệ thống</p>
          </div>
          <RoutesPrimaryButtons />
        </div>

        {/* Main Layout: Map + Tabs */}
        <div className='flex h-[calc(100vh-180px)] flex-col gap-4 lg:flex-row'>
          {/* Left side - Map */}
          <div className='h-full w-full lg:w-1/2'>
            <RouteMap selectedRouteId={selectedRoute?.id} checkpoints={checkpoints} />
          </div>

          {/* Right side - Tabs */}
          <div className='h-full w-full overflow-auto lg:w-1/2'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='flex h-full flex-col'>
              {/* Tabs header */}
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='routes'>Danh sách tuyến đường</TabsTrigger>
                <TabsTrigger value='checkpoints' disabled={!selectedRoute}>
                  Điểm dừng {selectedRoute ? `- ${selectedRoute.code}` : ''}
                </TabsTrigger>
              </TabsList>

              {/* Tabs content */}
              <TabsContent value='routes' className='flex-1 overflow-auto'>
                {/* Routes table */}
                {loading ? (
                  <div className='flex items-center justify-center p-8'>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  <RoutesTable data={routes} columns={columns as any} onRowClick={handleRouteSelect} />
                )}
              </TabsContent>

              <TabsContent value='checkpoints' className='flex-1 overflow-auto'>
                {/* Checkpoints list */}
                <Card>
                  <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                      {/* Tiêu đề */}
                      <div className='text-lg font-semibold'>{selectedRoute ? `Điểm dừng - ${selectedRoute.code}` : 'Chọn tuyến đường để xem điểm dừng'}</div>

                      {/* Các button hành động */}
                      {selectedRoute && (
                        <div className='flex gap-2'>
                          {/* Nút Sửa */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div onClick={handleEditClick} className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-muted/100 hover:bg-muted'>
                                  <IconPencil size={18} className='text-muted-foreground' />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sửa tuyến đường</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {/* Nút Xóa - từ từ */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className='flex h-8 w-8 items-center justify-center rounded-md bg-muted/100 hover:bg-muted' onClick={() => setOpenDeleteDialog(true)}>
                                  <IconTrash size={18} className='text-muted-foreground' />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Xóa tuyến đường</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {/* dialog delete */}
                          {selectedRoute && (
                            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Bạn có chắc chắn muốn xóa tuyến đường?</DialogTitle>
                                  <DialogDescription>
                                    Tuyến <b>{selectedRoute.code}</b> đang vận hành với <b>{checkpoints.length}</b> điểm dừng và <b>{checkpoints.reduce((sum, cp) => sum + (cp.studentCount || 0), 0)}</b> học sinh.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className='flex justify-end gap-2 pt-4'>
                                  <button onClick={() => setOpenDeleteDialog(false)} className='rounded-md border px-4 py-2 text-sm'>
                                    Hủy
                                  </button>
                                  <button onClick={() => handleConfirmDelete()} className='rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700'>
                                    Xóa
                                  </button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Error Alert */}
                    {error && (
                      <Alert variant='destructive' className='mb-4'>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Loading checkpoints */}
                    {loadingCheckpoints ? (
                      <div className='flex items-center justify-center py-4'>
                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                        <span>Đang tải điểm dừng...</span>
                      </div>
                    ) : checkpoints.length > 0 ? (
                      <Table>
                        {/* ======================================================================== */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>STT</TableHead>
                            <TableHead>Tên điểm dừng</TableHead>
                            {/* <TableHead>Mô tả</TableHead> */}
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className='text-left'>Số HS</TableHead>
                            {/* thao tác : chỉnh sửa , xóa */}
                            {/* <TableHead>Thao tác</TableHead> */}
                          </TableRow>
                        </TableHeader>
                        {/* ======================================================================== */}
                        <TableBody>
                          {checkpoints.map((checkpoint, index) => (
                            <TableRow key={checkpoint.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className='max-w-[160px] align-top'>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className='max-w-[150px] cursor-default truncate'>{checkpoint.name || '—'}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{checkpoint.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              {/* <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className='max-w-[150px] cursor-default truncate'>{checkpoint.description || '—'}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{checkpoint.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell> */}
                              <TableCell>
                                <Status color={checkpoint.status === 'ACTIVE' ? 'green' : 'red'} showDot={true}>
                                  {checkpoint.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                </Status>
                              </TableCell>
                              <TableCell className='text-left'>
                                <Badge variant='outline'>{checkpoint.studentCount || 0}</Badge>
                              </TableCell>
                              {/* ======================================================================== */}
                              {/* <TableCell className='text-right'>
                                <div className='flex gap-1 px-4 py-2'>
                                  <Link to={`/students/details/1`}>
                                    <div className='flex h-7 w-7 items-center justify-center rounded-md bg-muted/100 hover:bg-muted'>
                                      <IconPencil size={18} className='cursor-pointer text-muted-foreground' />
                                    </div>
                                  </Link>
                                </div>
                              </TableCell> */}
                              {/* <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className='cursor-pointer text-primary hover:underline'>Chỉnh sửa</div>
                                    </TooltipTrigger>
                                    <TooltipContent>Chỉnh sửa điểm dừng</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider> */}
                            </TableRow>
                          ))}
                        </TableBody>
                        {/* ======================================================================== */}
                      </Table>
                    ) : selectedRoute && !loadingCheckpoints && !error ? (
                      <div className='py-4 text-center text-muted-foreground'>Không có điểm dừng nào cho tuyến đường này</div>
                    ) : (
                      <div className='py-4 text-center text-muted-foreground'>Vui lòng chọn một tuyến đường từ tab Danh sách tuyến đường</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Main>
    </>
  )
}

// ============================
// Page Wrapper with Provider
// ============================
export default function Routes() {
  return (
    <RoutesProvider>
      <RoutesContent />
    </RoutesProvider>
  )
}
