'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getListCheckpointByRouteId, getNumberOfStudentInEachCheckpoint } from '@/features/transportation/function'
import RouteMap from '../components/map/route-map'
import { RoutesPrimaryButtons } from '../components/routes-primary-buttons'
import { columns } from '../components/table/routes-columns'
import { RoutesTable } from '../components/table/routes-table'
import RoutesProvider, { useRoutes } from '../context/routes-context'

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
}

function RoutesContent() {
  const { routes, loading } = useRoutes()
  const { toast } = useToast()
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [loadingCheckpoints, setLoadingCheckpoints] = useState(false)
  const [activeTab, setActiveTab] = useState('routes')
  const [error, setError] = useState<string | null>(null)

  // Function to handle route selection
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
        variant: 'default',
      })
    } catch (error) {
      console.error('Error selecting route:', error)
      setError(`Không thể tải thông tin tuyến đường ${route.code}. Vui lòng thử lại sau.`)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin tuyến đường',
        variant: 'destructive',
      })
    } finally {
      setLoadingCheckpoints(false)
    }
  }

  return (
    <>
      <Header fixed className='z-50'>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Danh sách tuyến đường</h2>
            <p className='text-muted-foreground'>Quản lý thông tin tuyến đường trên hệ thống</p>
          </div>
          <RoutesPrimaryButtons />
        </div>

        <div className='flex h-[calc(100vh-180px)] flex-col gap-4 lg:flex-row'>
          {/* Left side - Map */}
          <div className='h-full w-full lg:w-1/2'>
            <RouteMap selectedRouteId={selectedRoute?.id} checkpoints={checkpoints} />
          </div>

          {/* Right side - Tabbed interface */}
          <div className='h-full w-full overflow-auto lg:w-1/2'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='flex h-full flex-col'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='routes'>Danh sách tuyến đường</TabsTrigger>
                <TabsTrigger value='checkpoints' disabled={!selectedRoute}>
                  Điểm dừng {selectedRoute ? `- ${selectedRoute.code}` : ''}
                </TabsTrigger>
              </TabsList>

              {/* Routes Tab */}
              <TabsContent value='routes' className='flex-1 overflow-auto'>
                {loading ? (
                  <div className='flex items-center justify-center p-8'>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  <RoutesTable data={routes} columns={columns} onRowClick={handleRouteSelect} />
                )}
              </TabsContent>

              {/* Checkpoints Tab */}
              <TabsContent value='checkpoints' className='flex-1 overflow-auto'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg'>{selectedRoute ? `Điểm dừng - ${selectedRoute.code}` : 'Chọn tuyến đường để xem điểm dừng'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant='destructive' className='mb-4'>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {loadingCheckpoints ? (
                      <div className='flex items-center justify-center py-4'>
                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                        <span>Đang tải điểm dừng...</span>
                      </div>
                    ) : checkpoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>STT</TableHead>
                            <TableHead>Tên điểm dừng</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className='text-right'>Số học sinh</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {checkpoints.map((checkpoint, index) => (
                            <TableRow key={checkpoint.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className='font-medium'>{checkpoint.name}</TableCell>
                              <TableCell>{checkpoint.description}</TableCell>
                              <TableCell>
                                <Badge variant={checkpoint.status === 'ACTIVE' ? 'default' : 'secondary'}>{checkpoint.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</Badge>
                              </TableCell>
                              <TableCell className='text-right'>
                                <Badge variant='outline'>{checkpoint.studentCount || 0}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
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

export default function Routes() {
  return (
    <RoutesProvider>
      <RoutesContent />
    </RoutesProvider>
  )
}
