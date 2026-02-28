"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const mockProducts = [
  { id: "1", name: "Wireless Headphones", image: "/placeholder.svg", price: 79.99, stock: 45, status: "published" },
  { id: "2", name: "Smart Watch Pro", image: "/placeholder.svg", price: 199.99, stock: 12, status: "published" },
  { id: "3", name: "Laptop Stand", image: "/placeholder.svg", price: 49.99, stock: 0, status: "draft" },
  { id: "4", name: "USB-C Hub", image: "/placeholder.svg", price: 34.99, stock: 78, status: "published" },
  { id: "5", name: "Mechanical Keyboard", image: "/placeholder.svg", price: 129.99, stock: 23, status: "published" },
  { id: "6", name: "Camera Tripod", image: "/placeholder.svg", price: 65.00, stock: 5, status: "draft" },
]

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

export default function VendorProductsPage() {
  const t = useTranslations("vendor")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("products")}</h1>
        <Button asChild>
          <Link href={`/${locale}/vendor/products/new`}>
            <Plus className="h-4 w-4 me-2" />
            {t("addProduct")}
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={tCommon("search") + "..."}
          className="ps-9 max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>{tCommon("name")}</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/vendor/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
