"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 3600 },
  { month: "Mar", revenue: 3200 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 4100 },
  { month: "Jun", revenue: 5200 },
  { month: "Jul", revenue: 4800 },
  { month: "Aug", revenue: 5600 },
  { month: "Sep", revenue: 6100 },
  { month: "Oct", revenue: 5400 },
  { month: "Nov", revenue: 6800 },
  { month: "Dec", revenue: 7200 },
]

export function VendorRevenueChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
