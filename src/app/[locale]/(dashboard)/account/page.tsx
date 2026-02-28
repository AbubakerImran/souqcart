"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, Heart, MapPin, Eye } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

const mockStats = {
  totalOrders: 12,
  wishlistCount: 5,
  addressCount: 3,
}

const mockRecentOrders = [
  { id: "ord_1", number: "SC-ABC123", date: "2025-01-15", items: 3, total: 159.99, status: "delivered" },
  { id: "ord_2", number: "SC-DEF456", date: "2025-01-10", items: 1, total: 49.99, status: "shipped" },
  { id: "ord_3", number: "SC-GHI789", date: "2025-01-05", items: 2, total: 89.50, status: "processing" },
  { id: "ord_4", number: "SC-JKL012", date: "2024-12-28", items: 4, total: 234.00, status: "delivered" },
  { id: "ord_5", number: "SC-MNO345", date: "2024-12-20", items: 1, total: 29.99, status: "cancelled" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function AccountOverviewPage() {
  const t = useTranslations("account")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("welcome")}!</h1>
        <p className="text-muted-foreground">{t("overview")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("wishlist")}</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.wishlistCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("addresses")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.addressCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderDetail")}</TableHead>
                <TableHead>{t("orderDate")}</TableHead>
                <TableHead>{t("orderItems")}</TableHead>
                <TableHead>{t("orderTotal")}</TableHead>
                <TableHead>{t("orderStatus")}</TableHead>
                <TableHead className="text-right">{t("viewOrder")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>{formatDate(order.date, locale)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{formatPrice(order.total, locale)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]} variant="secondary">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${locale}/account/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
