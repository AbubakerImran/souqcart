"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const mockProducts = [
  { id: "1", name: "Wireless Headphones", image: "/placeholder.svg", vendor: "TechStore", price: 79.99, stock: 45, status: "published" },
  { id: "2", name: "Summer Dress", image: "/placeholder.svg", vendor: "Fashion Hub", price: 45.00, stock: 120, status: "published" },
  { id: "3", name: "Yoga Mat", image: "/placeholder.svg", vendor: "Sports Zone", price: 29.99, stock: 0, status: "draft" },
  { id: "4", name: "Coffee Maker", image: "/placeholder.svg", vendor: "Home Essentials", price: 89.99, stock: 34, status: "published" },
  { id: "5", name: "Novel Collection", image: "/placeholder.svg", vendor: "Book World", price: 24.99, stock: 200, status: "published" },
  { id: "6", name: "Smart Watch Pro", image: "/placeholder.svg", vendor: "TechStore", price: 199.99, stock: 12, status: "published" },
  { id: "7", name: "Organic Honey", image: "/placeholder.svg", vendor: "Organic Market", price: 15.99, stock: 56, status: "published" },
  { id: "8", name: "Running Shoes", image: "/placeholder.svg", vendor: "Sports Zone", price: 120.00, stock: 28, status: "published" },
]

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

export default function AdminProductsPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("manageProducts")}</h1>
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
                <TableHead>Image</TableHead>
                <TableHead>{tCommon("name")}</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>{formatPrice(product.price, locale)}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? "text-destructive font-medium" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[product.status]} variant="secondary">
                      {product.status}
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
