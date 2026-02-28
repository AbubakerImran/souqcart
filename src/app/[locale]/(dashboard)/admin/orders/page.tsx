"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

const mockOrders = [
  { id: "1", number: "SC-ABC123", customer: "Ahmed Ali", date: "2025-01-15", items: 3, total: 159.99, status: "delivered" },
  { id: "2", number: "SC-DEF456", customer: "Sara Khan", date: "2025-01-14", items: 1, total: 49.99, status: "shipped" },
  { id: "3", number: "SC-GHI789", customer: "Omar Hassan", date: "2025-01-13", items: 2, total: 89.50, status: "processing" },
  { id: "4", number: "SC-JKL012", customer: "Fatima Ahmed", date: "2025-01-12", items: 4, total: 234.00, status: "delivered" },
  { id: "5", number: "SC-MNO345", customer: "Youssef Salem", date: "2025-01-11", items: 1, total: 29.99, status: "cancelled" },
  { id: "6", number: "SC-PQR678", customer: "Layla Nasser", date: "2025-01-10", items: 2, total: 119.00, status: "pending" },
  { id: "7", number: "SC-STU901", customer: "Khalid Mansour", date: "2025-01-09", items: 1, total: 65.00, status: "shipped" },
  { id: "8", number: "SC-VWX234", customer: "Noor Ali", date: "2025-01-08", items: 3, total: 189.50, status: "processing" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function AdminOrdersPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("manageOrders")}</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={tCommon("search") + "..."} className="ps-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={tCommon("filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon("all")}</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>{tCommon("date")}</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{formatDate(order.date, locale)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{formatPrice(order.total, locale)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]} variant="secondary">
                      {order.status}
                    </Badge>
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
