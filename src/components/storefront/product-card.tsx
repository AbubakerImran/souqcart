"use client"

import { useTranslations } from "next-intl"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductData {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  image?: string | null
  vendorName?: string
  rating?: number
  reviewCount?: number
}

export function ProductCard({ product }: { product: ProductData }) {
  const t = useTranslations("product")
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null

  return (
    <div className="group relative rounded-xl border bg-card shadow-sm transition hover:shadow-md">
      {/* Wishlist button */}
      <button
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-muted-foreground backdrop-blur-sm transition hover:text-red-500"
        aria-label={t("addToWishlist")}
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Discount badge */}
      {discount && (
        <Badge className="absolute left-3 top-3 z-10" variant="destructive">
          {discount}% {t("off")}
        </Badge>
      )}

      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-t-xl bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        {product.vendorName && (
          <p className="text-xs text-muted-foreground">{product.vendorName}</p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < (product.rating ?? 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          {product.reviewCount != null && (
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("addToCart")}
        </Button>
      </div>
    </div>
  )
}
