// ===== Imports =====
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import AnalyticsCard from '@/components/mine/analytic-card'
import { Overview } from './components/overview'
import { dashboardData, extraDashboardData } from './fake-data'

// ===== Dashboard Component =====
export default function Dashboard() {
  const attendanceDiff = parseFloat((dashboardData.attendanceRateThisMonth - dashboardData.attendanceRateLastMonth).toFixed(1))
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập đủ ngày bắt đầu và ngày kết thúc.',
        variant: 'deny',
      })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: 'Lỗi',
        description: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
        variant: 'deny',
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      console.log('Ngày bắt đầu:', startDate)
      console.log('Ngày kết thúc:', endDate)

      toast({
        title: 'Thành công',
        description: `Đã mở đăng ký từ ${startDate} đến ${endDate}.`,
        variant: 'success',
      })

      setLoading(false)
      setOpen(false)
      setStartDate('')
      setEndDate('')
    }, 1000)
  }

  return (
    <>
      {/* ===== Header ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search placeholder='Tìm kiếm...' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Bảng điều khiển</h1>
          <div className='flex gap-2'>
            <Button>Tải xuống</Button>
            {/* <Button variant='outline'>Tạo báo cáo</Button> */}
            {/* <Button variant='outline'>Mở ngày đăng ký</Button> */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant='outline'>Mở ngày đăng ký</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thiết lập thời gian đăng ký</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='startDate' className='text-right'>
                      Ngày bắt đầu
                    </Label>
                    <Input id='startDate' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='col-span-3' />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='endDate' className='text-right'>
                      Ngày kết thúc
                    </Label>
                    <Input id='endDate' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='col-span-3' />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleConfirm} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ===== Tabs ===== */}
        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Phân tích
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Báo cáo
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== Tab Content ===== */}
          <TabsContent value='overview' className='space-y-4'>
            {/* KPI Cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <AnalyticsCard label='Học sinh đang hoạt động ' value='12,450' changeText='94.6% đang hoạt động' />
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>HS đang hoạt động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.activeStudents} / {dashboardData.totalStudents}
                  </div>
                  <p className='text-xs text-muted-foreground'>{((dashboardData.activeStudents / dashboardData.totalStudents) * 100).toFixed(1)}% đang hoạt động</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>Tuyến xe đang hoạt động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.activeBuses} / {dashboardData.totalBuses}
                  </div>
                  <p className='text-xs text-muted-foreground'>{((dashboardData.activeBuses / dashboardData.totalBuses) * 100).toFixed(1)}% đang hoạt động</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>Tài khoản người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{dashboardData.totalAccounts}</div>
                  <p className='text-xs text-muted-foreground'>Phụ huynh, tài xế, phụ xe</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>Tỉ lệ điểm danh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{dashboardData.attendanceRateThisMonth.toFixed(1)}%</div>
                  <p className={`text-xs ${attendanceDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>{attendanceDiff > 0 ? `+${attendanceDiff}%` : `${attendanceDiff}%`} so với tháng trước</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart + Mini Blocks */}
            <div className='grid gap-4 lg:grid-cols-3'>
              {/* Attendance Chart */}
              <Card className='col-span-2'>
                <CardHeader>
                  <CardTitle>Tổng quan điểm danh</CardTitle>
                  <CardDescription>Tỉ lệ điểm danh (%) theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <Overview />
                </CardContent>
              </Card>

              {/* Mini-blocks Section */}
              <div className='grid gap-4'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Yêu cầu chờ xử lý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{extraDashboardData.pendingRequests}</div>
                    <p className='text-xs text-muted-foreground'>Từ phụ huynh</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Yêu cầu đổi điểm dừng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{extraDashboardData.checkpointChangeRequests}</div>
                    <p className='text-xs text-muted-foreground'>Từ phụ huynh</p>
                  </CardContent>
                </Card>

                {/* Tổng số điểm dừng */}
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Tổng số điểm dừng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{extraDashboardData.totalCheckpoints}</div>
                    <p className='text-xs text-muted-foreground'>Đang được sử dụng</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
