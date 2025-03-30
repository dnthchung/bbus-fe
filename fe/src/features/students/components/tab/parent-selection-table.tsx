'use client'

//path : fe/src/features/students/components/tab/parent-selection-table.tsx
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, Search, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllUsersRoleParent } from '@/features/users/data/users'
import type { StudentForm } from '../dialog/students-edit-view-dialog'

// Parent type based on your existing code
interface Parent {
  userId: string
  name: string
  phone: string
  email: string
  gender: string
  address: string
}

export function ParentSelectionTable() {
  const [open, setOpen] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const [filteredParents, setFilteredParents] = useState<Parent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)

  const { setValue, watch } = useFormContext<StudentForm>()
  const currentParentId = watch('parentId')

  // Fetch parents when dialog opens
  useEffect(() => {
    if (open) {
      fetchParents()
    }
  }, [open])

  // Set selected parent when currentParentId changes
  useEffect(() => {
    if (currentParentId && parents.length > 0) {
      const parent = parents.find((p) => p.userId === currentParentId)
      if (parent) {
        setSelectedParent(parent)
        setSelectedParentId(parent.userId)
      }
    }
  }, [currentParentId, parents])

  // Filter parents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParents(parents)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = parents.filter((parent) => parent.name.toLowerCase().includes(query) || parent.phone.includes(query))
      setFilteredParents(filtered)
    }
  }, [searchQuery, parents])

  const fetchParents = async () => {
    setIsLoading(true)
    try {
      // Using the getAllUsersRoleParent function mentioned in your imports
      const response = await getAllUsersRoleParent()
      if (response) {
        console.log('response', response)
        setParents(
          response.map((user) => ({
            userId: user.userId,
            name: user.name,
            phone: user.phone,
            email: user.email,
            gender: user.gender || 'OTHER', // Provide default value if undefined
            address: user.address,
          }))
        )
        setFilteredParents(
          response.map((user) => ({
            userId: user.userId,
            name: user.name,
            phone: user.phone,
            email: user.email,
            gender: user.gender || 'OTHER',
            address: user.address,
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching parents:', error)
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
      setValue('parentId', selectedParentId)
      const parent = parents.find((p) => p.userId === selectedParentId)
      if (parent) {
        setSelectedParent(parent)
      }
      setOpen(false)
    }
  }

  const handleClearSelection = () => {
    setValue('parentId', '')
    setSelectedParent(null)
    setSelectedParentId(null)
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' type='button'>
              Chọn phụ huynh
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Danh sách phụ huynh</DialogTitle>
              <DialogDescription>Vui lòng chọn một phụ huynh từ danh sách bên dưới.</DialogDescription>
            </DialogHeader>

            <div className='relative mb-4'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Tìm kiếm theo tên hoặc số điện thoại...' className='pl-9' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

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

        {selectedParent && (
          <Button variant='ghost' size='icon' type='button' onClick={handleClearSelection} className='h-9 w-9'>
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {selectedParent ? (
        <div className='rounded-md border p-3'>
          <div className='flex flex-col gap-1'>
            <div className='text-sm font-medium'>{selectedParent.name}</div>
            <div className='text-sm text-muted-foreground'>{selectedParent.phone}</div>
          </div>
        </div>
      ) : (
        <Input placeholder='Chưa chọn phụ huynh' value={currentParentId} readOnly disabled />
      )}
    </div>
  )
}
