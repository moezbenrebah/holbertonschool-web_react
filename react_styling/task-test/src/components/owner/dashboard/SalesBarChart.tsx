'use client'

import { BarChart } from "@tremor/react"

type SalesDataType = {
  month: string;
  sales: number;
}

const formatEuro = (value: number) => `${value}€`

export default function SalesBarChart({ data }: { data: SalesDataType[] }) {
  return (
    <BarChart
      data={data}
      index="month"
      categories={["sales"]}
      colors={["amber"]}
      className="min-h-[300px]"
      valueFormatter={formatEuro}
    />
  )
}
