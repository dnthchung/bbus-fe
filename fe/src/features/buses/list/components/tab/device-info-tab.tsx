'use client'

import type React from 'react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/mine/badge'
import type { Bus } from '@/features/buses/schema'

interface DeviceInfoTabProps {
  bus: Bus
  onBusUpdate: (updatedBus: Bus) => void
}

export function DeviceInfoTab({ bus, onBusUpdate }: DeviceInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    espId: bus.espId || '',
    cameraFacesluice: bus.cameraFacesluice || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
        description: 'Đã cập nhật thông tin thiết bị',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin thiết bị',
        variant: 'deny',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      espId: bus.espId || '',
      cameraFacesluice: bus.cameraFacesluice || '',
    })
    setEditing(false)
  }

  return (
    <div className='mt-5 space-y-1'>
      {/* Header & Action Buttons */}
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Thông tin thiết bị</h3>
        {editing ? (
          <div className='flex space-x-2'>
            <Button variant='outline' onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        ) : (
          <Button variant='secondary' onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Table-like structure */}
      {editing ? (
        <div className='overflow-hidden rounded-md border'>
          <div className='text-sm'>
            {/* GPS ID */}
            <div className='flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>GPS ID</div>
              <div className='flex-1 px-4 py-3'>
                <Input name='espId' value={formData.espId} onChange={handleChange} placeholder='Nhập GPS ID' className='h-8' />
              </div>
            </div>

            {/* Camera ID */}
            <div className='flex'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Camera ID</div>
              <div className='flex-1 px-4 py-3'>
                <Input name='cameraFacesluice' value={formData.cameraFacesluice} onChange={handleChange} placeholder='Nhập Camera ID' className='h-8' />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='overflow-hidden rounded-md border'>
          <div className='text-sm'>
            {/* GPS ID */}
            <div className='flex border-b'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>GPS ID</div>
              <div className='flex-1 px-4 py-3'>{bus.espId || <Badge color='yellow'>Trống</Badge>}</div>
            </div>

            {/* Camera ID */}
            <div className='flex'>
              <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Camera ID</div>
              <div className='flex-1 px-4 py-3'>{bus.cameraFacesluice || <Badge color='yellow'>Trống</Badge>}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
