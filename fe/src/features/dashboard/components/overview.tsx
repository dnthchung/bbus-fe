'use client'

// src/features/dashboard/components/overview.tsx
import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { getAttendanceRate } from '@/features/dashboard/functions'

export function Overview() {
  const [chartData, setChartData] = useState<{ name: string; rate: number }[]>([])

  useEffect(() => {
    async function fetchChartData() {
      try {
        const data = await getAttendanceRate()
        setChartData(data)
      } catch (err) {
        console.error('Failed to fetch attendance chart data', err)
      }
    }
    fetchChartData()
  }, [])

  return (
    <ResponsiveContainer width='100%' height={250}>
      <BarChart data={chartData}>
        <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Bar dataKey='rate' radius={[6, 6, 0, 0]} className='fill-primary' />
      </BarChart>
    </ResponsiveContainer>
  )
}

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

// const data = [
//   {
//     name: 'Jan',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Feb',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Mar',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Apr',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'May',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jun',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jul',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Aug',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Sep',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Oct',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Nov',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Dec',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]

// export function Overview() {
//   return (
//     <ResponsiveContainer width='100%' height={350}>
//       <BarChart data={data}>
//         <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
//         <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
//         <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
//       </BarChart>
//     </ResponsiveContainer>
//   )
// }
