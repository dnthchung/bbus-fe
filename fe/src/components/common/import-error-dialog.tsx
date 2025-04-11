'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PaginationControl } from '@/components/common/pagination-control'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  errors: Record<string, string> // { "2": "Lỗi dòng 2: Email không hợp lệ", ... }
  title?: string
  description?: string
}

const ITEMS_PER_PAGE = 10

export function ImportErrorDialog({ open, onOpenChange, errors, title = 'Lỗi khi nhập file', description = 'Danh sách các dòng lỗi trong file Excel của bạn:' }: Props) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const errorList = useMemo(() => {
    return Object.entries(errors)
      .filter(([line, msg]) => (search.trim() === '' ? true : msg.toLowerCase().includes(search.toLowerCase()) || line.includes(search)))
      .sort((a, b) => Number(a[0]) - Number(b[0]))
  }, [errors, search])

  const totalPages = Math.ceil(errorList.length / ITEMS_PER_PAGE)

  const currentErrors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return errorList.slice(start, start + ITEMS_PER_PAGE)
  }, [errorList, page])

  const handleDownloadLog = () => {
    const content = errorList.map(([line, msg]) => `Dòng ${line}: ${msg}`).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'import-errors.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-2'>
            <Input
              placeholder='Tìm dòng hoặc nội dung lỗi...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className='w-2/3'
            />
            <Button variant='secondary' onClick={handleDownloadLog}>
              Tải file các thông báo lỗi
            </Button>
          </div>

          <Separator />

          <ScrollArea className='h-64 rounded border'>
            <table className='w-full text-sm'>
              <thead className='sticky top-0 bg-gray-100 dark:bg-gray-800'>
                <tr>
                  <th className='w-20 px-3 py-2 text-left'>Dòng</th>
                  <th className='px-3 py-2 text-left'>Chi tiết lỗi</th>
                </tr>
              </thead>
              <tbody>
                {currentErrors.length > 0 ? (
                  currentErrors.map(([line, msg]) => (
                    <tr key={line} className='border-t'>
                      <td className='px-3 py-2 font-semibold'>{line}</td>
                      <td className='px-3 py-2'>{msg}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className='p-4 text-center text-muted-foreground'>
                      Không tìm thấy lỗi phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>

          {totalPages > 1 && <PaginationControl page={page} total={totalPages} onPageChange={setPage} className='justify-end pt-2' />}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
