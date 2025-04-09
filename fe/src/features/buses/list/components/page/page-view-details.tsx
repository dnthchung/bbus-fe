// fe/src/features/buses/list/components/page/page-view-details.tsx
import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/mine/badge'
import { Status } from '@/components/mine/status'
import { getBusById, getAllAssistants, getAllBuses } from '@/features/buses/buses'
import { statusLabels } from '@/features/buses/data'
import { Bus } from '@/features/buses/schema'

export default function PageViewDetails() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const [bus, setBus] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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
              {/* <Button variant='outline' className='mt-4' onClick={() => fetchData()}>
                Thử lại
              </Button> */}
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
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Tên xe buýt</p>
                    <p className='font-medium'>{bus.name || 'Chưa có tên'}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Biển số xe</p>
                    <p className='font-medium'>{bus.licensePlate || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Mã tuyến</p>
                    <p className='font-medium'>{bus.routeCode || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Trạng thái</p>
                    <Status color={bus.busStatus === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[bus.busStatus] || bus.busStatus}</Status>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Số học sinh</p>
                    <p className='font-medium'>{bus.amountOfStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin tài xế và phụ xe</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Tài xế</p>
                    <p className='font-medium'>{bus.driverName || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>SĐT tài xế</p>
                    <p className='font-medium'>{bus.driverPhone || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Phụ xe</p>
                    <p className='font-medium'>{bus.assistantName || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>SĐT phụ xe</p>
                    <p className='font-medium'>{bus.assistantPhone || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin thiết bị</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>GPS ID</p>
                    <p className='font-medium'>{bus.espId || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Camera ID</p>
                    <p className='font-medium'>{bus.cameraFacesluice || <Badge color='yellow'>Trống</Badge>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-2'>
                <Button variant='outline'>Chỉnh sửa thông tin</Button>
                <Button variant='destructive'>Vô hiệu hóa</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
    </>
  )
}
