'use client'

// ===== Imports =====
import { useState } from 'react'
import { IconBus, IconDropletQuestion, IconUser, IconFileTypeDoc } from '@tabler/icons-react'
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
import { dashboardData, summaryMetrics } from './fake-data'

//path : fe/src/features/dashboard/index.tsx

// ===== Dashboard Component =====
export default function Dashboard() {
  const attendanceDiff = Number.parseFloat((dashboardData.attendanceRateThisMonth - dashboardData.attendanceRateLastMonth).toFixed(1))
  const [loading, setLoading] = useState(false)
  const [eventDialogOpen, setEventDialogOpen] = useState(false)

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
            {/* <Button
              onClick={() => {
                toast({
                  title: 'Tải xuống thành công',
                  description: 'Đã tải xuống tất cả báo cáo (1 file Excel với nhiều sheet)',
                  variant: 'success',
                })
              }}
            >
              Tải xuống
            </Button> */}
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
              <AnalyticsCard icon={<IconUser className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số học sinh đang hoạt động' value={summaryMetrics.activeStudents} changeText={`${((summaryMetrics.activeStudents / dashboardData.totalStudents) * 100).toFixed(1)}%`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconBus className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số tuyến xe bus đang hoạt động' value={summaryMetrics.activeBuses} changeText={`${((summaryMetrics.activeBuses / dashboardData.totalBuses) * 100).toFixed(1)}%`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconFileTypeDoc className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Tổng số tài khoản người dùng' value={summaryMetrics.totalAccounts} changeText={`Tổng số tài khoản trong hệ thống`} changeTextVariant='green' />

              <AnalyticsCard icon={<IconDropletQuestion className='h-4 w-4 text-gray-600 dark:text-gray-300' />} label='Yêu cầu đang chờ' value={summaryMetrics.pendingRequests} changeText={`Cần xử lý ${summaryMetrics.pendingRequests} yêu cầu`} changeTextVariant='red' />
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
