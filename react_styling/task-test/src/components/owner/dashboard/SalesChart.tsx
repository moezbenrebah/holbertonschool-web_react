'use client'

import { getSalesData } from '@/lib/dashboard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useEffect, useState } from 'react'

export default function SalesChart({ data }: { data: any }) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.datasets[0].data.map((value: number, index: number) => ({
            name: data.labels[index],
            "Cette année": value,
            "Année précédente": data.datasets[1].data[index]
          }))}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Cette année"
            stroke="rgb(245, 158, 11)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Année précédente"
            stroke="rgb(209, 213, 219)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
