'use client'

import type React from 'react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/mine/badge'
import { Status } from '@/components/mine/status'
import { statusLabels } from '@/features/buses/data'
import type { Bus } from '@/features/buses/schema'

interface BasicInfoTabProps {
  bus: Bus
  onBusUpdate: (updatedBus: Bus) => void
}

export function BasicInfoTab({ bus, onBusUpdate }: BasicInfoTabProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: bus.name || '',
    licensePlate: bus.licensePlate || '',
    routeCode: bus.routeCode || '',
    busStatus: bus.busStatus,
    amountOfStudents: bus.amountOfStudents,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amountOfStudents' ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      busStatus: value as 'ACTIVE' | 'INACTIVE',
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
        description: 'Đã cập nhật thông tin cơ bản',
        variant: 'success',
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin cơ bản',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: bus.name || '',
      licensePlate: bus.licensePlate || '',
      routeCode: bus.routeCode || '',
      busStatus: bus.busStatus,
      amountOfStudents: bus.amountOfStudents,
    })
    setEditing(false)
  }

  return (
    <div className='mt-5 space-y-1'>
      {/* Header & Action Buttons */}
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Thông tin cơ bản</h3>
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
      <div className='overflow-hidden rounded-md border'>
        <div className='text-sm'>
          {/* Tên xe buýt */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Tên xe buýt</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='name' value={formData.name} onChange={handleChange} placeholder='Nhập tên xe buýt' className='h-8' /> : bus.name || 'Chưa có tên'}</div>
          </div>

          {/* Biển số xe */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Biển số xe</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='licensePlate' value={formData.licensePlate} onChange={handleChange} placeholder='Nhập biển số xe' className='h-8' /> : bus.licensePlate || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Mã tuyến */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mã tuyến</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input name='routeCode' value={formData.routeCode} onChange={handleChange} placeholder='Nhập mã tuyến' className='h-8' /> : bus.routeCode || <Badge color='yellow'>Trống</Badge>}</div>
          </div>

          {/* Trạng thái */}
          <div className='flex border-b'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Trạng thái</div>
            <div className='flex-1 px-4 py-3'>
              {editing ? (
                <Select value={formData.busStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className='h-8 w-full'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ACTIVE'>{statusLabels.ACTIVE}</SelectItem>
                    <SelectItem value='INACTIVE'>{statusLabels.INACTIVE}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Status color={bus.busStatus === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[bus.busStatus] || bus.busStatus}</Status>
              )}
            </div>
          </div>

          {/* Số học sinh */}
          <div className='flex'>
            <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Số học sinh</div>
            <div className='flex-1 px-4 py-3'>{editing ? <Input type='number' name='amountOfStudents' value={formData.amountOfStudents} onChange={handleChange} placeholder='Nhập số học sinh' className='h-8' /> : bus.amountOfStudents}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
