"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { formatPrice, formatDate } from "@/lib/utils"
import { toast } from "sonner"

const mockOrders = [
  { id: "1", number: "SC-V001", customer: "Ahmed Ali", date: "2025-01-15", items: 2, total: 89.99, status: "processing" },
  { id: "2", number: "SC-V002", customer: "Sara Khan", date: "2025-01-14", items: 1, total: 149.50, status: "shipped" },
  { id: "3", number: "SC-V003", customer: "Omar Hassan", date: "2025-01-13", items: 3, total: 45.00, status: "delivered" },
  { id: "4", number: "SC-V004", customer: "Fatima Ahmed", date: "2025-01-12", items: 1, total: 230.00, status: "processing" },
  { id: "5", number: "SC-V005", customer: "Youssef Salem", date: "2025-01-11", items: 2, total: 67.50, status: "delivered" },
  { id: "6", number: "SC-V006", customer: "Layla Nasser", date: "2025-01-10", items: 1, total: 155.00, status: "pending" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function VendorOrdersPage() {
  const t = useTranslations("vendor")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const [orders, setOrders] = useState(mockOrders)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("orders")}</h1>
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
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
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
                  <TableCell className="text-right">
                    <Select
                      value={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
