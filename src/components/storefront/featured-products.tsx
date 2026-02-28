"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import { Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  image?: string | null
  vendorName?: string
  rating?: number
  reviewCount?: number
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("home")

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">
          {t("featuredProducts")}
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("viewAll")} →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Products coming soon
          </p>
          <p className="text-sm text-muted-foreground">
            Check back later for featured products
          </p>
        </div>
      )}
    </section>
  )
}
