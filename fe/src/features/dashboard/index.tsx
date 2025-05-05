'use client'

// ===== Imports =====
import { useEffect, useState } from 'react'
import { IconBus, IconUser, IconFileTypeDoc, IconUsersGroup } from '@tabler/icons-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import AnalyticsCard from '@/components/mine/analytic-card'
import { DownloadableReports } from './components/common/downloadable-reports'
import { EventDialog } from './components/common/event-dialogs'
import { Overview } from './components/overview'
import { dashboardData } from './fake-data'
import { dem_so_hoc_sinh, dem_so_yeu_cau, thong_so_account, tong_tuyen_duong } from './functions'
import { getPreDataForFinalReport } from './functions'

//path : fe/src/features/dashboard/index.tsx

type Metrics = {
  studentCount: number
  busRouteCount: number
  totalAccounts: number
  pendingRequests: number
}

// ===== Dashboard Component =====
export default function Dashboard() {
  const attendanceDiff = Number.parseFloat((dashboardData.attendanceRateThisMonth - dashboardData.attendanceRateLastMonth).toFixed(1))
  const [loading, setLoading] = useState(false)
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({
    studentCount: 0,
    busRouteCount: 0,
    totalAccounts: 0,
    pendingRequests: 0,
  })

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [student, totalUsers, totalRoutes, requestStats] = await Promise.all([
          dem_so_hoc_sinh(), // Trả về số: 53
          thong_so_account(), // Trả về số: 61
          tong_tuyen_duong(), // Trả về số: 2
          dem_so_yeu_cau(), // Trả về object: { pendingRequests, totalRequests }
        ])

        setMetrics({
          studentCount: student ?? 0,
          totalAccounts: totalUsers ?? 0,
          busRouteCount: totalRoutes ?? 0,
          pendingRequests: requestStats?.pendingRequests ?? 0,
        })
      } catch (err) {
        console.error('Dashboard fetch failed', err)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    async function fetchPreData() {
      try {
        const preData = await getPreDataForFinalReport()
        console.log('Pre data for final report:', preData)
      } catch (err) {
        console.error('Failed to fetch pre data for final report', err)
      }
    }

    fetchPreData()
  }, [])

  return (
    <>
      {/* ===== Header ===== */}
      <Header fixed>
        <div className='flex w-full items-center'>
          <Breadcrumb className='flex-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bảng điều khiển</BreadcrumbPage>
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

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Bảng điều khiển</h1>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setEventDialogOpen(true)}>
              Mở ngày đăng ký
            </Button>
          </div>
        </div>
        {/* ===================================================================================== */}
        <EventDialog
          open={eventDialogOpen}
          onClose={() => {
            setEventDialogOpen(false)
            // Optional: refresh data after event creation
            // fetchEvents();
          }}
          mode='create'
          title='Mở ngày đăng ký điểm đón'
          submitLabel='Lưu'
        />
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
              <AnalyticsCard icon={<IconUser className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số học sinh đang hoạt động' value={metrics.studentCount} changeText={`Học sinh sử dụng hệ thống`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconBus className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số tuyến xe bus' value={metrics.busRouteCount} changeText={`Tổng tuyến xe hiện có`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconUsersGroup className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số tài khoản người dùng' value={metrics.totalAccounts} changeText={`Tài khoản người dùng hệ thống`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconFileTypeDoc className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Yêu cầu đang chờ cần xử lý' value={metrics.pendingRequests} changeText={`Cần xử lý ${metrics.pendingRequests} yêu cầu`} changeTextVariant='red' />
            </div>

            {/* Chart + Mini Blocks */}
            <div className='grid gap-4 lg:grid-cols-3'>
              {/* Attendance Chart */}
              <Card className='col-span-2'>
                <CardHeader>
                  <CardTitle>Tổng quan điểm danh</CardTitle>
                  <CardDescription>Tỉ lệ điểm danh (%) theo tháng</CardDescription>
                  {/* Attendance Rate (%) = (Số lượt điểm danh thành công / Tổng số lượt cần điểm danh) * 100 Ví dụ: Tổng số học sinh cần đi học hôm nay: 500 Mỗi học sinh có 2 lượt cần điểm danh (lên xe và xuống xe) → Tổng lượt cần điểm danh: 500 x 2 = 1000 Lượt điểm danh thành công (AI nhận diện đúng & lưu log): 950 → Attendance Rate = (950 / 1000) * 100 = 95% */}
                </CardHeader>
                <CardContent>
                  <Overview />
                </CardContent>
              </Card>

              {/* Reports Section */}
              <div className='grid gap-4'>
                <DownloadableReports />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
