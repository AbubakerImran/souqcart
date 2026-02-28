"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 18400 },
  { month: "Feb", revenue: 22600 },
  { month: "Mar", revenue: 25200 },
  { month: "Apr", revenue: 28500 },
  { month: "May", revenue: 32100 },
  { month: "Jun", revenue: 35200 },
  { month: "Jul", revenue: 38800 },
  { month: "Aug", revenue: 42600 },
  { month: "Sep", revenue: 39100 },
  { month: "Oct", revenue: 44400 },
  { month: "Nov", revenue: 48800 },
  { month: "Dec", revenue: 52200 },
]

const ordersData = [
  { month: "Jan", orders: 840 },
  { month: "Feb", orders: 960 },
  { month: "Mar", orders: 1050 },
  { month: "Apr", orders: 1120 },
  { month: "May", orders: 1280 },
  { month: "Jun", orders: 1150 },
  { month: "Jul", orders: 1340 },
  { month: "Aug", orders: 1420 },
  { month: "Sep", orders: 1280 },
  { month: "Oct", orders: 1500 },
  { month: "Nov", orders: 1650 },
  { month: "Dec", orders: 1780 },
]

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
}

export function AdminChartsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
