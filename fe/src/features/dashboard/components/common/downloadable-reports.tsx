'use client'

import { useState } from 'react'
import { exportYearReportExcel } from '@/helpers/export-excel'
import { Download, FileSpreadsheet } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

//path : fe/src/features/dashboard/components/common/downloadable-reports.tsx
// Define report types
const reportTypes = [
  {
    id: 'summary',
    name: 'Báo cáo tổng kết năm học',
    description: 'Thống kê tổng hợp về năm học',
  },
  {
    id: 'attendance',
    name: 'Báo cáo điểm danh học sinh',
    description: 'Thông tin thống kê điểm danh học sinh',
  },
  {
    id: 'activity',
    name: 'Báo cáo hoạt động của xe bus',
    description: 'Báo cáo hoạt động của tài xế và phụ xe',
  },
]

export function DownloadableReports() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = (reportId: string) => {
    setDownloading(reportId)

    // Simulate download delay
    setTimeout(() => {
      // toast({
      //   title: 'Tải xuống thành công',
      //   description: `Đã tải xuống báo cáo ${reportTypes.find((r) => r.id === reportId)?.name}`,
      //   variant: 'success',

      // })

      toast({
        title: 'Chức năng chưa khả dụng',
        description: `Chức năng tải xuống báo cáo ${reportTypes.find((r) => r.id === reportId)?.name} chưa khả dụng`,
        variant: 'default',
      })
      setDownloading(null)
    }, 1000)
  }

  const handleDownloadAll = async () => {
    try {
      setDownloading('all')
      await exportYearReportExcel()
      toast({
        title: 'Tải xuống thành công',
        description: 'Đã tải xuống tất cả báo cáo (1 file Excel với nhiều sheet)',
        variant: 'success',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Tải xuống thất bại',
        description: 'Vui lòng thử lại sau',
      })
    } finally {
      setDownloading(null)
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-md font-medium'>Báo cáo có thể tải xuống</CardTitle>
        <Button variant='outline' size='sm' onClick={handleDownloadAll} disabled={downloading !== null}>
          {downloading === 'all' ? 'Đang tải...' : 'Tải tất cả'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại báo cáo</TableHead>
              <TableHead className='hidden md:table-cell'>Mô tả</TableHead>
              <TableHead className='w-[100px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportTypes.map((report) => (
              <TableRow key={report.id}>
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-2'>
                    <FileSpreadsheet className='h-4 w-4 text-muted-foreground' />
                    <span>{report.name}</span>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>{report.description}</TableCell>
                <TableCell>
                  {/* <Button variant='ghost' size='icon' onClick={() => handleDownload(report.id)} disabled={downloading !== null}>
                    <Download className='h-4 w-4' />
                    <span className='sr-only'>Tải xuống {report.name}</span>
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
