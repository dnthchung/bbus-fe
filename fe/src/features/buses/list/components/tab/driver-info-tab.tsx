'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/mine/badge'
import { getAvailableAssistants, getAvailableDrivers } from '@/features/buses/buses'
import type { Bus } from '@/features/buses/schema'

interface DriverInfoTabProps {
  bus: Bus
  onBusUpdate: (updatedBus: Bus) => void
}

export default function DriverInfoTab({ bus, onBusUpdate }: DriverInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [drivers, setDrivers] = useState<any[]>([])
  const [assistants, setAssistants] = useState<any[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [loadingAssistants, setLoadingAssistants] = useState(false)
  const [driverSearch, setDriverSearch] = useState('')
  const [assistantSearch, setAssistantSearch] = useState('')

  const [formData, setFormData] = useState({
    driverName: bus.driverName || '',
    driverPhone: bus.driverPhone || '',
    driverId: bus.driverId || '',
    assistantName: bus.assistantName || '',
    assistantPhone: bus.assistantPhone || '',
    assistantId: bus.assistantId || '',
  })

  const fetchDriversAndAssistants = async () => {
    try {
      setLoadingDrivers(true)
      setLoadingAssistants(true)

      // Fetch drivers
      const driversData = await getAvailableDrivers()
      setDrivers(driversData)

      // Fetch assistants
      const assistantsData = await getAvailableAssistants()
      setAssistants(assistantsData)
    } catch (error) {
      console.error('Error fetching drivers and assistants:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tài xế và phụ xe',
        variant: 'destructive',
      })
    } finally {
      setLoadingDrivers(false)
      setLoadingAssistants(false)
    }
  }

  const handleEditClick = () => {
    setEditing(true)
    fetchDriversAndAssistants()
  }

  const handleCancel = () => {
    setFormData({
      driverName: bus.driverName || '',
      driverPhone: bus.driverPhone || '',
      driverId: bus.driverId || '',
      assistantName: bus.assistantName || '',
      assistantPhone: bus.assistantPhone || '',
      assistantId: bus.assistantId || '',
    })
    setEditing(false)
  }

  const handleSave = async () => {
    try {
      // Here you would call your API to update the bus
      const updatedBus = {
        ...bus,
        ...formData,
      }

      onBusUpdate(updatedBus)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin tài xế và phụ xe',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin tài xế và phụ xe',
        variant: 'destructive',
      })
    }
  }

  const handleSelectDriver = (driver: any) => {
    setFormData((prev) => ({
      ...prev,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
    }))
  }

  const handleSelectAssistant = (assistant: any) => {
    setFormData((prev) => ({
      ...prev,
      assistantId: assistant.id,
      assistantName: assistant.name,
      assistantPhone: assistant.phone,
    }))
  }

  const filteredDrivers = drivers.filter((driver) => driver.name?.toLowerCase().includes(driverSearch.toLowerCase()) || driver.phone?.toLowerCase().includes(driverSearch.toLowerCase()))

  const filteredAssistants = assistants.filter((assistant) => assistant.name?.toLowerCase().includes(assistantSearch.toLowerCase()) || assistant.phone?.toLowerCase().includes(assistantSearch.toLowerCase()))

  return (
    <div className='mt-5 space-y-1'>
      {/* Header & Action Buttons */}
      <div className='mb-4 flex w-1/2 items-center justify-between'>
        <h3 className='text-lg font-medium'>Thông tin tài xế và phụ xe</h3>
        {editing ? (
          <div className='flex space-x-2'>
            <Button variant='outline' onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        ) : (
          <Button variant='secondary' onClick={handleEditClick}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Current Info Table */}
      <div className='w-1/2 overflow-hidden rounded-md border'>
        <div className='text-sm'>
          {/* Cặp 1: Tài xế */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Tài xế</div>
            <div className='flex-1 px-4 py-3'>{formData.driverName || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Cặp 2: SĐT tài xế */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>SĐT tài xế</div>
            <div className='flex-1 px-4 py-3'>{formData.driverPhone || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Cặp 3: Phụ xe */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Phụ xe</div>
            <div className='flex-1 px-4 py-3'>{formData.assistantName || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Cặp 4: SĐT phụ xe */}
          <div className='flex'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>SĐT phụ xe</div>
            <div className='flex-1 px-4 py-3'>{formData.assistantPhone || <Badge color='yellow'>Trống</Badge>}</div>
          </div>
        </div>
      </div>

      {/* Selections (only visible in edit mode) */}
      {editing && (
        <div
          className='flex space-x-2'
          style={{
            marginTop: '2rem',
          }}
        >
          {/* Drivers Selection */}
          <div className='w-1/2'>
            <div className='mb-2 flex items-center justify-around'>
              <h4 className='font-medium'>Chọn tài xế</h4>
              <div className='relative w-64'>
                <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input placeholder='Tìm kiếm tài xế...' value={driverSearch} onChange={(e) => setDriverSearch(e.target.value)} className='h-8 pl-9' />
              </div>
            </div>
            <div className='overflow-hidden rounded-md border'>
              <ScrollArea className='h-64'>
                {loadingDrivers ? (
                  <div className='flex h-64 items-center justify-center'>
                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  </div>
                ) : filteredDrivers.length === 0 ? (
                  <div className='flex h-64 items-center justify-center text-muted-foreground'>Không tìm thấy tài xế</div>
                ) : (
                  <div className='text-sm'>
                    {filteredDrivers.map((driver) => (
                      <div key={driver.id} className={`flex cursor-pointer border-b hover:bg-muted/50 ${formData.driverId === driver.id ? 'bg-muted/50' : ''}`} onClick={() => handleSelectDriver(driver)}>
                        <div className='w-1/2 px-4 py-3'>{driver.name}</div>
                        <div className='w-1/2 px-4 py-3 text-muted-foreground'>{driver.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Assistants Selection */}
          <div className='w-1/2'>
            <div className='mb-2 flex items-center justify-around'>
              <h4 className='font-medium'>Chọn phụ xe</h4>
              <div className='relative w-64'>
                <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input placeholder='Tìm kiếm phụ xe...' value={assistantSearch} onChange={(e) => setAssistantSearch(e.target.value)} className='h-8 pl-9' />
              </div>
            </div>
            <div className='overflow-hidden rounded-md border'>
              <ScrollArea className='h-64'>
                {loadingAssistants ? (
                  <div className='flex h-64 items-center justify-center'>
                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  </div>
                ) : filteredAssistants.length === 0 ? (
                  <div className='flex h-64 items-center justify-center text-muted-foreground'>Không tìm thấy phụ xe</div>
                ) : (
                  <div className='text-sm'>
                    {filteredAssistants.map((assistant) => (
                      <div key={assistant.id} className={`flex cursor-pointer border-b hover:bg-muted/50 ${formData.assistantId === assistant.id ? 'bg-muted/50' : ''}`} onClick={() => handleSelectAssistant(assistant)}>
                        <div className='w-1/2 px-4 py-3'>{assistant.name}</div>
                        <div className='w-1/2 px-4 py-3 text-muted-foreground'>{assistant.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
