// fe/src/features/buses/list/components/page/page-view-details.tsx
import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getBusById } from '@/features/buses/buses'
import { BasicInfoTab } from '@/features/buses/list/components/tab/basic-info-tab'
import { DeviceInfoTab } from '@/features/buses/list/components/tab/device-info-tab'
import DriverInfoTab from '@/features/buses/list/components/tab/driver-info-tab'
import { Bus } from '@/features/buses/schema'

export default function PageViewDetails() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const [bus, setBus] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const busData = await getBusById(id ?? '')
        //data result : {amountOfStudents : 14 assistantId : "83bcd928-ed7e-422f-a57c-49a52f34223b" assistantName : "assistant" assistantPhone : "0912345670" busStatus : "ACTIVE" cameraFacesluice : "1001001" driverId : "6946cf4c-9e26-4305-9541-3e7680b104f9" driverName : "teacher" driverPhone : "0912345674" espId : "001001" id : "84389627-6cd4-42bd-a5fd-049623e2c99e" licensePlate : "30A-921.12" name : "Bus 001" routeCode : "R002" routeId : "33597c4a-a9c5-44c9-a2d9-75eb0bbbcb72"}
        setBus(busData)
        setError(null)
      } catch (err) {
        console.error('Error fetching bus details:', err)
        setError(err instanceof Error ? err : new Error('Không thể tải thông tin xe buýt'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleBack = () => {
    navigate({ to: '/buses/list' })
  }

  const handleBusUpdate = async (updatedBus: Bus) => {
    if (!id) return

    try {
      // Make sure the ID is included in the update payload
      const busUpdatePayload = {
        // Remove redundant id assignment since it will be spread from updatedBus
        ...updatedBus,
      }

      // Call the API to update the bus
      await API_SERVICES.buses.update_bus(busUpdatePayload)

      // Update the local state with the updated bus data
      setBus(updatedBus)

      toast({
        title: 'Thành công',
        description: 'Thông tin xe buýt đã được cập nhật',
        variant: 'success',
      })
    } catch (err) {
      console.error('Error updating bus:', err)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin xe buýt',
        variant: 'deny',
      })
    }
  }

  const handleStatusUpdate = async () => {
    if (!bus || !id) return

    // Kiểm tra nếu đang active và có học sinh trên xe
    if (bus.busStatus === 'ACTIVE' && bus.amountOfStudents > 0) {
      toast({
        title: 'Không thể vô hiệu hóa',
        description: 'Không thể vô hiệu hóa xe buýt khi còn học sinh trên xe và xe đang trong tuyến đường hoạt động',
        variant: 'deny',
      })
      return
    }

    try {
      setUpdatingStatus(true)
      const newStatus = bus.busStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await API_SERVICES.buses.update_status(id, newStatus)
      setBus({
        ...bus,
        busStatus: newStatus,
      })
      toast({
        title: 'Thành công',
        description: newStatus === 'ACTIVE' ? 'Xe buýt đã được kích hoạt' : 'Xe buýt đã bị vô hiệu hóa',
        variant: 'success',
      })
    } catch (err) {
      console.error('Error updating bus status:', err)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái xe buýt',
        variant: 'deny',
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Quản lý xe bus</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/buses/list'>Danh sách xe bus</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-muted-foreground'>Chi tiết</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> {loading ? 'Đang tải…' : bus?.name || 'Chi tiết'}</BreadcrumbPage>
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

      <Main>
        <div className='mb-6'>
          <Button variant='outline' size='sm' onClick={handleBack}>
            <ArrowLeftIcon className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>

        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Thông tin chi tiết xe buýt</h1>
          <p className='text-muted-foreground'>Xem và quản lý thông tin chi tiết của xe buýt.</p>
        </div>

        {loading ? (
          <div className='w-full'>
            <div className='space-y-6'>
              {/* Back button skeleton */}
              <div className='mb-6'>
                <Skeleton className='h-9 w-36' />
              </div>

              {/* Title skeleton */}
              <div className='mb-6'>
                <Skeleton className='mb-2 h-8 w-64' />
                <Skeleton className='h-5 w-96' />
              </div>

              {/* Tabs skeleton */}
              <div className='mb-6'>
                <Skeleton className='mb-4 h-10 w-1/2' />

                {/* Tab content skeleton */}
                <Card>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      {/* Form fields skeleton */}
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className='grid grid-cols-2 gap-4'>
                            <Skeleton className='h-5 w-32' />
                            <Skeleton className='h-10 w-full' />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action button skeleton */}
              <div className='border-t pt-4'>
                <Skeleton className='h-10 w-32' />
              </div>
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className='py-10 text-center'>
              <div className='text-destructive'>
                <p className='text-lg font-semibold'>Đã xảy ra lỗi</p>
                <p>{error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : !bus ? (
          <Card>
            <CardContent className='py-10 text-center'>
              <p className='text-lg font-semibold'>Không tìm thấy thông tin xe buýt</p>
              <Button variant='outline' className='mt-4' onClick={handleBack}>
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue='basic' className='mb-6'>
              <TabsList className='grid w-1/2 grid-cols-3'>
                <TabsTrigger value='basic'>Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value='driver'>Thông tin tài xế và phụ xe</TabsTrigger>
                <TabsTrigger value='device'>Thông tin thiết bị</TabsTrigger>
              </TabsList>

              <TabsContent className='w-full' value='basic'>
                <BasicInfoTab bus={bus} onBusUpdate={handleBusUpdate} />
              </TabsContent>

              <TabsContent value='driver'>
                <DriverInfoTab bus={bus} onBusUpdate={handleBusUpdate} />
              </TabsContent>

              <TabsContent className='w-1/2' value='device'>
                <DeviceInfoTab bus={bus} onBusUpdate={handleBusUpdate} />
              </TabsContent>
            </Tabs>

            <div className='border-t pt-4'>
              {bus.busStatus === 'ACTIVE' ? (
                <Button variant='destructive' onClick={handleStatusUpdate} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : 'Vô hiệu hóa'}
                </Button>
              ) : (
                <Button variant='default' onClick={handleStatusUpdate} disabled={updatingStatus}>
                  {updatingStatus ? 'Đang xử lý...' : 'Kích hoạt'}
                </Button>
              )}
            </div>
          </>
        )}
      </Main>
    </>
  )
}
