// @refresh reset
import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthQuery } from '@/hooks/use-auth'

export function withGuestRoute<T extends object>(
  Component: React.ComponentType<T>
) {
  return (props: T) => {
    const { user, isLoading } = useAuthQuery()
    const navigate = useNavigate()

    useEffect(() => {
      // Nếu không còn loading và user tồn tại, chuyển hướng đến trang chính
      if (!isLoading && user) {
        navigate({ to: '/' })
      }
    }, [isLoading, user, navigate])

    // Trong lúc đang tải hoặc nếu user đã tồn tại (đang chuyển hướng) hiển thị Loading
    if (isLoading || user) {
      return <div>Loading...</div>
    }

    // Nếu chưa đăng nhập, render component gốc
    return <Component {...props} />
  }
}
