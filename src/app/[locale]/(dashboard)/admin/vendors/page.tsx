"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

const mockVendors = [
  { id: "1", store: "TechStore", owner: "Omar Hassan", products: 48, revenue: 24680.50, verified: true },
  { id: "2", store: "Fashion Hub", owner: "Sara Khan", products: 156, revenue: 89450.00, verified: true },
  { id: "3", store: "Home Essentials", owner: "Youssef Salem", products: 72, revenue: 32100.00, verified: true },
  { id: "4", store: "Sports Zone", owner: "Khalid Mansour", products: 94, revenue: 45230.00, verified: false },
  { id: "5", store: "Book World", owner: "Layla Nasser", products: 280, revenue: 18900.00, verified: true },
  { id: "6", store: "Organic Market", owner: "Noor Ali", products: 35, revenue: 12400.00, verified: false },
]

export default function AdminVendorsPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("manageVendors")}</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={tCommon("search") + "..."} className="ps-9" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {vendor.store.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{vendor.store}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.owner}</TableCell>
                  <TableCell>{vendor.products}</TableCell>
                  <TableCell>{formatPrice(vendor.revenue, locale)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        vendor.verified
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }
                    >
                      {vendor.verified ? tCommon("verified") : tCommon("pending")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!vendor.verified && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                            onClick={() => toast.success(t("approveVendor"))}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => toast.success(t("rejectVendor"))}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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
