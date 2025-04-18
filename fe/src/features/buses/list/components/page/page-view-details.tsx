// fe/src/features/buses/list/components/page/page-view-details.tsx
import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
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
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
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
          <div className='flex items-center justify-center py-10'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
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
