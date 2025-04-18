'use client'

import { useState, useEffect } from 'react'
import { Check, Search, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/mine/badge'
import { getParentListFromParentTable } from '@/features/users/users'

interface Parent {
  userId: string
  name: string
  phone: string
  email: string
  gender: string
  address: string
}

interface ParentSelectionTableProps {
  initialParentId?: string
  onParentSelect: (parentId: string) => void
}

export function ParentSelectionTable({ initialParentId, onParentSelect }: ParentSelectionTableProps) {
  const [open, setOpen] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const [filteredParents, setFilteredParents] = useState<Parent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(initialParentId || null)
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)

  useEffect(() => {
    if (open) fetchParents()
  }, [open])

  useEffect(() => {
    if (initialParentId && parents.length > 0) {
      const parent = parents.find((p) => p.userId === initialParentId)
      if (parent) {
        setSelectedParent(parent)
        setSelectedParentId(parent.userId)
      }
    }
  }, [initialParentId, parents])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredParents(parents)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredParents(parents.filter((p) => p.name.toLowerCase().includes(query) || p.phone.toLowerCase().includes(query)))
    }
  }, [searchQuery, parents])

  const fetchParents = async () => {
    setIsLoading(true)
    try {
      const response = await getParentListFromParentTable()
      const mapped = response.map((user: any) => ({
        userId: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        gender: user.gender || 'OTHER',
        address: user.address,
      }))
      setParents(mapped)
      setFilteredParents(mapped)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phụ huynh. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectParent = (parent: Parent) => {
    setSelectedParentId(parent.userId)
  }

  const handleConfirmSelection = () => {
    if (selectedParentId) {
      onParentSelect(selectedParentId)
      const parent = parents.find((p) => p.userId === selectedParentId)
      if (parent) setSelectedParent(parent)
      setOpen(false)
    }
  }

  const handleClearSelection = () => {
    onParentSelect('')
    setSelectedParent(null)
    setSelectedParentId(null)
  }

  return (
    <div className='space-y-2'>
      {/* Button + Clear */}
      <div className='flex items-center gap-2'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>Chọn phụ huynh</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Danh sách phụ huynh</DialogTitle>
              <DialogDescription>Vui lòng chọn một phụ huynh từ danh sách bên dưới.</DialogDescription>
            </DialogHeader>

            {/* Search */}
            <div className='relative mb-4'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Tìm kiếm theo tên hoặc số điện thoại...' className='pl-9' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Table */}
            <ScrollArea className='h-[300px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[40px]'></TableHead>
                    <TableHead>Tên phụ huynh</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className='py-4 text-center'>
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : filteredParents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className='py-4 text-center'>
                        Không tìm thấy phụ huynh
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParents.map((parent) => (
                      <TableRow key={parent.userId} className={`cursor-pointer ${selectedParentId === parent.userId ? 'bg-primary/10' : ''}`} onClick={() => handleSelectParent(parent)}>
                        <TableCell>{selectedParentId === parent.userId && <Check className='h-4 w-4 text-primary' />}</TableCell>
                        <TableCell>{parent.name}</TableCell>
                        <TableCell>{parent.phone}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Footer */}
            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmSelection} disabled={!selectedParentId}>
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Clear */}
        {selectedParent && (
          <Button variant='ghost' size='icon' onClick={handleClearSelection}>
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Thông tin phụ huynh đã chọn (dạng bảng) */}
      <Table className='rounded-md border text-sm'>
        <TableBody>
          <TableRow>
            <TableCell className='w-1/4 bg-muted/50 font-medium'>Tên phụ huynh</TableCell>
            <TableCell>{selectedParent?.name || <Badge color='yellow'>Trống</Badge>}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='w-1/4 bg-muted/50 font-medium'>Số điện thoại</TableCell>
            <TableCell>{selectedParent?.phone || <Badge color='yellow'>Trống</Badge>}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='w-1/4 bg-muted/50 font-medium'>Email</TableCell>
            <TableCell>{selectedParent?.email || <Badge color='yellow'>Trống</Badge>}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='w-1/4 bg-muted/50 font-medium'>Địa chỉ</TableCell>
            <TableCell>{selectedParent?.address || <Badge color='yellow'>Trống</Badge>}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
