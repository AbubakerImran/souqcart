"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Store, Package, ShoppingCart, DollarSign, Percent } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { AdminChartsSection } from "./charts"

const mockKPIs = {
  totalUsers: 3240,
  totalVendors: 128,
  totalProducts: 4560,
  totalOrders: 12890,
  platformRevenue: 458320.50,
  commissionEarned: 45832.05,
}

const mockActivity = [
  { id: "1", message: "New vendor 'Fashion Hub' registered", date: "2025-01-15T14:30:00Z" },
  { id: "2", message: "Order SC-XYZ789 delivered successfully", date: "2025-01-15T13:15:00Z" },
  { id: "3", message: "Product 'Premium Watch' flagged for review", date: "2025-01-15T12:00:00Z" },
  { id: "4", message: "User ahmed@example.com updated profile", date: "2025-01-15T11:45:00Z" },
  { id: "5", message: "New coupon 'WINTER25' created", date: "2025-01-15T10:30:00Z" },
  { id: "6", message: "Vendor 'TechStore' payout processed: $1,234.56", date: "2025-01-15T09:00:00Z" },
]

export default function AdminDashboardPage() {
  const t = useTranslations("admin")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalVendors")}</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalProducts")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalProducts.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalOrders.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("platformRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(mockKPIs.platformRevenue, locale)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("commissionEarned")}</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(mockKPIs.commissionEarned, locale)}</div>
          </CardContent>
        </Card>
      </div>

      <AdminChartsSection />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivity.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                <p className="text-sm">{item.message}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.date, locale)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
