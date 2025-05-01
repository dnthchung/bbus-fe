'use client'

import type React from 'react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/transportation/routes/list/details/edit/$id'
import { Loader2, ArrowUp, ArrowDown, Plus, X, AlertTriangle, Save, ArrowLeft, SearchIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { Search } from '@/components/common/search'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Status } from '@/components/mine/status'
import { getAllCheckpointButNotInRoute, getAllCheckpointButNotInRouteWithoutInActive, getRouteByRouteId, editRouteByRouteId, getNumberOfStudentInEachCheckpoint, getListCheckpointByRouteId } from '@/features/transportation/function'

// Define interfaces
interface Checkpoint {
  id: string
  name: string
  description?: string
  status: string
  studentCount?: number
  latitude?: string | number
  longitude?: string | number
}

interface RouteData {
  id: string
  code: string
  description: string
  path?: string
}

export default function EditRouteManagement() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // States
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [selectedCheckpoints, setSelectedCheckpoints] = useState<Checkpoint[]>([])
  const [availableCheckpoints, setAvailableCheckpoints] = useState<Checkpoint[]>([])
  const [filteredCheckpoints, setFilteredCheckpoints] = useState<Checkpoint[]>([])
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  // Fetch route data
  useEffect(() => {
    async function fetchRouteData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch route data
        const routeData = await getRouteByRouteId(id)
        // console.log('====> Route data:', routeData)
        if (!routeData) {
          throw new Error('Không thể tải thông tin tuyến đường')
        }

        setRouteData(routeData)

        // Fetch checkpoints for this route
        const checkpoints = await getListCheckpointByRouteId(id)
        if (!checkpoints || !Array.isArray(checkpoints)) {
          console.error('Invalid checkpoints data:', checkpoints)
          throw new Error('Không thể tải danh sách điểm dừng')
        }

        // Fetch student counts for each checkpoint
        const checkpointsWithStudentCount = await Promise.all(
          checkpoints.map(async (checkpoint: Checkpoint) => {
            try {
              const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
              return {
                ...checkpoint,
                studentCount: studentCount || 0,
              }
            } catch (error) {
              console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
              return {
                ...checkpoint,
                studentCount: 0,
              }
            }
          })
        )

        setSelectedCheckpoints(checkpointsWithStudentCount)

        // Fetch available checkpoints
        const availableCheckpoints = await getAllCheckpointButNotInRouteWithoutInActive()
        // Sort available checkpoints by student count (descending)
        const sortedCheckpoints = availableCheckpoints
          ? [...availableCheckpoints].sort((a, b) => {
              const countA = a.studentCount || 0
              const countB = b.studentCount || 0
              return countB - countA
            })
          : []

        setAvailableCheckpoints(sortedCheckpoints)
        setFilteredCheckpoints(sortedCheckpoints)
      } catch (error) {
        console.error('Error fetching route data:', error)
        setError('Không thể tải thông tin tuyến đường. Vui lòng thử lại sau.')
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin tuyến đường',
          variant: 'deny',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRouteData()
  }, [id, toast])

  // Filter checkpoints based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCheckpoints(availableCheckpoints)
      return
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const filtered = availableCheckpoints.filter((checkpoint) => {
      const name = checkpoint.name || ''
      const description = checkpoint.description || ''
      return name.toLowerCase().includes(lowerCaseSearchTerm) || description.toLowerCase().includes(lowerCaseSearchTerm)
    })
    setFilteredCheckpoints(filtered)
  }, [searchTerm, availableCheckpoints])

  // Track changes
  useEffect(() => {
    if (loading) return
    setHasChanges(true)
  }, [selectedCheckpoints, loading])

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  // Add checkpoint
  const handleAddCheckpoint = () => {
    if (!selectedCheckpoint) return

    const checkpointToAdd = availableCheckpoints.find((cp) => cp.id === selectedCheckpoint)
    if (!checkpointToAdd) return

    // Add to the end of selectedCheckpoints
    setSelectedCheckpoints([...selectedCheckpoints, checkpointToAdd])

    // Remove from available checkpoints
    setAvailableCheckpoints(availableCheckpoints.filter((cp) => cp.id !== selectedCheckpoint))
    setFilteredCheckpoints(filteredCheckpoints.filter((cp) => cp.id !== selectedCheckpoint))

    // Reset selection
    setSelectedCheckpoint('')
    setSearchTerm('')
  }

  // Move checkpoint up
  const moveCheckpointUp = (index: number) => {
    // if (index === 0) return
    // Không cho move điểm cuối cùng
    if (index === 0 || index === selectedCheckpoints.length - 1) return

    const updatedCheckpoints = [...selectedCheckpoints]
    const temp = updatedCheckpoints[index]
    updatedCheckpoints[index] = updatedCheckpoints[index - 1]
    updatedCheckpoints[index - 1] = temp

    setSelectedCheckpoints(updatedCheckpoints)
  }

  // Move checkpoint down
  const moveCheckpointDown = (index: number) => {
    // if (index === selectedCheckpoints.length - 1) return // Already at the bottom
    // Không cho move điểm cuối cùng
    if (index === selectedCheckpoints.length - 1 || index === selectedCheckpoints.length - 2) return

    const updatedCheckpoints = [...selectedCheckpoints]
    const temp = updatedCheckpoints[index]
    updatedCheckpoints[index] = updatedCheckpoints[index + 1]
    updatedCheckpoints[index + 1] = temp

    setSelectedCheckpoints(updatedCheckpoints)
  }

  // Remove checkpoint
  const handleRemoveCheckpoint = (index: number) => {
    const checkpointToRemove = selectedCheckpoints[index]
    if (!checkpointToRemove) return

    // Check if checkpoint has students
    if (checkpointToRemove.studentCount && checkpointToRemove.studentCount > 0) {
      toast({
        title: 'Không thể xóa',
        description: `Điểm dừng "${checkpointToRemove.name}" đang có ${checkpointToRemove.studentCount} học sinh đăng ký.`,
        variant: 'deny',
      })
      return
    }

    if (index === selectedCheckpoints.length - 1) {
      toast({
        title: 'Không thể xóa điểm đích',
        description: 'Điểm đến cuối cùng của tuyến đường phải được giữ cố định.',
        variant: 'deny',
      })
      return
    }

    // Remove from selected checkpoints
    const updatedSelected = [...selectedCheckpoints]
    updatedSelected.splice(index, 1)
    setSelectedCheckpoints(updatedSelected)

    // Add back to available checkpoints and sort by student count
    const updatedAvailable = [...availableCheckpoints, checkpointToRemove]
    const sortedAvailable = updatedAvailable.sort((a, b) => {
      const countA = a.studentCount || 0
      const countB = b.studentCount || 0
      return countB - countA
    })

    setAvailableCheckpoints(sortedAvailable)

    // Update filtered checkpoints
    if (!searchTerm.trim()) {
      setFilteredCheckpoints(sortedAvailable)
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      setFilteredCheckpoints(sortedAvailable.filter((cp) => cp.name.toLowerCase().includes(lowerCaseSearchTerm) || (cp.description && cp.description.toLowerCase().includes(lowerCaseSearchTerm))))
    }
  }

  const reloadRouteData = async () => {
    try {
      setLoading(true)
      const updatedRouteData = await getRouteByRouteId(id)
      const updatedCheckpoints = await getListCheckpointByRouteId(id)

      if (updatedRouteData && updatedCheckpoints) {
        setRouteData(updatedRouteData)

        const checkpointsWithStudentCount = await Promise.all(
          updatedCheckpoints.map(async (checkpoint: Checkpoint) => {
            try {
              const studentCount = await getNumberOfStudentInEachCheckpoint(checkpoint.id)
              return { ...checkpoint, studentCount: studentCount || 0 }
            } catch (error) {
              console.error(`Error fetching student count for checkpoint ${checkpoint.id}:`, error)
              return { ...checkpoint, studentCount: 0 }
            }
          })
        )

        setSelectedCheckpoints(checkpointsWithStudentCount)
      }
    } catch (error) {
      console.error('Error reloading route data:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lại thông tin tuyến đường',
        variant: 'deny',
      })
    } finally {
      setLoading(false)
    }
  }

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!routeData) {
        throw new Error('Không có dữ liệu tuyến đường để lưu')
      }
      const orderedCheckpointIds = selectedCheckpoints.map((cp) => cp.id)
      // Prepare data for API
      // const updateData = {
      //   routeId: id,
      //   orderedCheckpointIds: selectedCheckpoints.map((cp) => cp.id),
      // }

      console.log('Route data:', orderedCheckpointIds)
      console.log('id route', id)
      // const dataSend = {
      //   routeId: id,
      //   orderedCheckpointIds: orderedCheckpointIds,
      // }
      const routeId = id

      // Call API to update route
      await editRouteByRouteId(routeId, orderedCheckpointIds)

      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin tuyến đường thành công',
        variant: 'success',
      })

      setHasChanges(false)
      setShowSaveDialog(false)

      // Navigate back to routes list
      // navigate({ to: '/transportation/routes/list' })

      await reloadRouteData()
    } catch (error: any) {
      console.error('Error saving route:', error)
      setError(error.message || 'Không thể cập nhật tuyến đường. Vui lòng thử lại sau.')
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật tuyến đường',
        variant: 'deny',
      })
      setShowSaveDialog(false)
    } finally {
      setSaving(false)
    }
  }

  // Handle save button click
  const handleSaveClick = () => {
    if (selectedCheckpoints.length < 2) {
      toast({
        title: 'Không thể lưu',
        description: 'Tuyến đường phải có ít nhất 2 điểm dừng',
        variant: 'deny',
      })
      return
    }

    setShowSaveDialog(true)
  }

  // Handle cancel button click
  const handleCancelClick = () => {
    if (hasChanges) {
      setShowLeaveDialog(true)
    } else {
      navigate({ to: '/transportation/routes/list' })
    }
  }

  // Navigate back without saving
  const handleLeaveWithoutSaving = () => {
    setShowLeaveDialog(false)
    navigate({ to: '/transportation/routes/list' })
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
                <span className='text-muted-foreground'>Quản lý tuyến đường</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/transportation/routes/list'>DS tuyến đường</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tuyến {routeData?.code}</BreadcrumbPage>
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
        <div>
          {/* Page header */}
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Chỉnh sửa tuyến đường {routeData?.code}</h1>
              <p className='text-muted-foreground'>Cập nhật điểm dừng của tuyến đường</p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={handleCancelClick}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Quay lại
              </Button>
              <Button onClick={handleSaveClick} disabled={saving || selectedCheckpoints.length < 2}>
                {saving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang lưu
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='mr-2 h-6 w-6 animate-spin' />
              <span>Đang tải thông tin tuyến đường...</span>
            </div>
          ) : error ? (
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-6'>
              <div className='flex justify-between'>
                {/* Route information */}
                <Card className='w-1/3 shadow-sm'>
                  <CardHeader>
                    <CardTitle>Thông tin tuyến đường</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-4'>
                      <div>
                        <Label htmlFor='code'>Mã tuyến đường</Label>
                        <Input id='code' value={routeData?.code || ''} disabled />
                      </div>
                      <div>
                        <Label htmlFor='description'>Mô tả tuyến đường</Label>
                        <Input id='description' value={routeData?.description || ''} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Help text */}
                <div className='w-1/3'>
                  <Alert>
                    <AlertTitle>
                      <b>Hướng dẫn</b>
                    </AlertTitle>
                    <AlertDescription>
                      <ul className='ml-6 list-disc text-sm'>
                        <li>Sử dụng nút mũi tên lên/xuống để thay đổi thứ tự các điểm dừng.</li>
                        <li>Không thể xóa điểm dừng đang có học sinh đăng ký.</li>
                        <li>Thêm điểm dừng mới từ danh sách điểm dừng khả dụng.</li>
                        <li>Thứ tự điểm dừng sẽ quyết định lộ trình của tuyến đường.</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              {/* Checkpoints management */}
              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle>Quản lý điểm dừng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    {/* Add new checkpoint */}
                    <div className='space-y-2'>
                      <div className='flex justify-end gap-2'>
                        {/* Search input nhỏ */}
                        <div className='relative w-1/4 min-w-[150px]'>
                          <Input ref={searchInputRef} placeholder='Tìm kiếm điểm dừng...' value={searchTerm} onChange={handleSearchChange} className='pr-8' />
                          <SearchIcon className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        </div>

                        {/* Select checkpoint */}
                        <Select value={selectedCheckpoint} onValueChange={setSelectedCheckpoint}>
                          <SelectTrigger className='w-[280px]'>
                            <SelectValue placeholder='Chọn điểm dừng để thêm' />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCheckpoints.length === 0 ? (
                              <SelectItem value='empty' disabled>
                                Không có điểm dừng khả dụng
                              </SelectItem>
                            ) : (
                              <SelectGroup>
                                <SelectLabel>Điểm dừng khả dụng ({filteredCheckpoints.length})</SelectLabel>
                                {filteredCheckpoints.map((checkpoint) => (
                                  <SelectItem key={checkpoint.id} value={checkpoint.id}>
                                    {checkpoint.name} {checkpoint.studentCount ? `(${checkpoint.studentCount} HS)` : ''}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>

                        {/* Add button */}
                        <Button onClick={handleAddCheckpoint} disabled={!selectedCheckpoint}>
                          <Plus className='mr-2 h-4 w-4' />
                          Thêm
                        </Button>
                      </div>

                      {/* Tìm thấy bao nhiêu điểm dừng */}
                      {filteredCheckpoints.length < availableCheckpoints.length && (
                        <div className='text-right text-xs text-muted-foreground'>
                          Tìm thấy {filteredCheckpoints.length} / {availableCheckpoints.length} điểm dừng
                        </div>
                      )}
                    </div>

                    {/* Checkpoint list */}
                    <div>
                      <h3 className='mb-2 font-medium'>Danh sách điểm dừng ({selectedCheckpoints.length})</h3>
                      {selectedCheckpoints.length === 0 ? (
                        <div className='rounded-md border border-dashed p-6 text-center text-muted-foreground'>Chưa có điểm dừng nào trong tuyến đường này</div>
                      ) : (
                        <div className='rounded-md border'>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead style={{ width: 50 }}>STT</TableHead>
                                <TableHead>Tên điểm dừng</TableHead>
                                <TableHead>Mã</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Số HS</TableHead>
                                <TableHead style={{ width: 120 }}>Thứ tự</TableHead>
                                <TableHead style={{ width: 50 }}></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedCheckpoints.map((checkpoint, index) => (
                                <TableRow key={checkpoint.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className='max-w-[200px] cursor-default truncate'>{checkpoint.name}</div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{checkpoint.name}</p>
                                          {checkpoint.description && <p className='text-xs text-muted-foreground'>{checkpoint.description}</p>}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </TableCell>
                                  <TableCell>{checkpoint.id}</TableCell>
                                  <TableCell>
                                    <Status color={checkpoint.status === 'ACTIVE' ? 'green' : 'red'} showDot={true}>
                                      {checkpoint.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                    </Status>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant='outline'>{checkpoint.studentCount || 0}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className='flex space-x-1'>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant='ghost' size='icon' onClick={() => moveCheckpointUp(index)} disabled={index === 0 || index === selectedCheckpoints.length - 1} className='h-8 w-8'>
                                              <ArrowUp className='h-4 w-4' />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Di chuyển lên</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant='ghost' size='icon' onClick={() => moveCheckpointDown(index)} disabled={index === selectedCheckpoints.length - 1 || index === selectedCheckpoints.length - 2} className='h-8 w-8'>
                                              <ArrowDown className='h-4 w-4' />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Di chuyển xuống</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant='ghost' size='icon' onClick={() => handleRemoveCheckpoint(index)} className={checkpoint.studentCount && checkpoint.studentCount > 0 ? 'cursor-not-allowed opacity-50' : ''}>
                                            <X className='h-4 w-4' />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{checkpoint.studentCount && checkpoint.studentCount > 0 ? 'Không thể xóa điểm dừng có học sinh' : 'Xóa điểm dừng'}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={handleCancelClick}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveClick} disabled={saving || selectedCheckpoints.length < 2}>
                    {saving ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang lưu
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </Main>

      {/* Save confirmation dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn lưu thay đổi cho tuyến đường {routeData?.code} không?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowSaveDialog(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave without saving dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rời khỏi trang</DialogTitle>
            <DialogDescription>Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này không?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowLeaveDialog(false)}>
              Ở lại
            </Button>
            <Button variant='destructive' onClick={handleLeaveWithoutSaving}>
              Rời khỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
