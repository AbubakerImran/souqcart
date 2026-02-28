"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { toast } from "sonner"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
    vendorId: string
    vendorName: string
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const t = useTranslations("product")
  const tc = useTranslations("cart")
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      stock: product.stock,
    })
    toast.success(tc("itemAdded"))
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = "/checkout"
  }

  const toggleWishlist = () => {
    if (inWishlist) {
      removeWishlistItem(product.id)
      toast.success(t("removeFromWishlist"))
    } else {
      addWishlistItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        stock: product.stock,
      })
      toast.success(t("addToWishlist"))
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div>
        <label className="mb-2 block text-sm font-medium">{t("quantity")}</label>
        <div className="inline-flex items-center rounded-lg border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-l-lg transition hover:bg-muted"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-10 w-14 items-center justify-center border-x text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-r-lg transition hover:bg-muted"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {t("addToCart")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={toggleWishlist}
          className={inWishlist ? "text-red-500 hover:text-red-600" : ""}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
        </Button>
      </div>

      <Button
        size="lg"
        variant="secondary"
        className="w-full"
        onClick={handleBuyNow}
        disabled={product.stock === 0}
      >
        {t("buyNow")}
      </Button>
    </div>
  )
}
