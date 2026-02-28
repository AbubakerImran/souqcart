"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 18400, commission: 1840 },
  { month: "Feb", revenue: 22600, commission: 2260 },
  { month: "Mar", revenue: 25200, commission: 2520 },
  { month: "Apr", revenue: 28500, commission: 2850 },
  { month: "May", revenue: 32100, commission: 3210 },
  { month: "Jun", revenue: 35200, commission: 3520 },
  { month: "Jul", revenue: 38800, commission: 3880 },
  { month: "Aug", revenue: 42600, commission: 4260 },
  { month: "Sep", revenue: 39100, commission: 3910 },
  { month: "Oct", revenue: 44400, commission: 4440 },
  { month: "Nov", revenue: 48800, commission: 4880 },
  { month: "Dec", revenue: 52200, commission: 5220 },
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

const topVendorsData = [
  { name: "Fashion Hub", revenue: 89450 },
  { name: "TechStore", revenue: 24680 },
  { name: "Sports Zone", revenue: 45230 },
  { name: "Home Essentials", revenue: 32100 },
  { name: "Book World", revenue: 18900 },
]

const topProductsData = [
  { name: "Summer Dress", sales: 450, color: "#3b82f6" },
  { name: "Smart Watch", sales: 380, color: "#22c55e" },
  { name: "Running Shoes", sales: 320, color: "#a855f7" },
  { name: "Wireless Headphones", sales: 290, color: "#eab308" },
  { name: "Coffee Maker", sales: 210, color: "#ef4444" },
]

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
}

export default function AdminAnalyticsPage() {
  const t = useTranslations("admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("analytics")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue & Commission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="commission"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.1}
                  name="Commission"
                />
              </AreaChart>
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
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVendorsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={110} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProductsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
