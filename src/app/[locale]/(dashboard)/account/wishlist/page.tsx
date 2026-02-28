"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function WishlistPage() {
  const t = useTranslations("account")
  const tProduct = useTranslations("product")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: `${item.productId}-default`,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      vendorId: item.vendorId,
      vendorName: item.vendorName,
      stock: item.stock,
    })
    toast.success(tProduct("addToCart"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("wishlist")}</h1>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("noWishlist")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">
                  {locale === "ar" && item.nameAr ? item.nameAr : item.name}
                </h3>
                <p className="text-lg font-bold mt-1">{formatPrice(item.price, locale)}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 me-2" />
                    {tProduct("addToCart")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
