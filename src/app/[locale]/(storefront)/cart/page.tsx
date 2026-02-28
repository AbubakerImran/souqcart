"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingCart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { useState } from "react"
import { toast } from "sonner"

export default function CartPage() {
  const t = useTranslations("cart")
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getTotal()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.15
  const total = subtotal + shipping + tax - discount

  // Group items by vendor
  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.vendorName || "Unknown Vendor"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      toast.success(t("couponApplied"))
    } else {
      setDiscount(0)
      toast.error(t("couponInvalid"))
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-6 rounded-full bg-muted p-8">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">{t("empty")}</h2>
        <p className="mb-8 text-center text-muted-foreground">{t("emptyMessage")}</p>
        <Link href="/products">
          <Button size="lg">{t("continueShopping")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([vendorName, vendorItems]) => (
              <div key={vendorName} className="rounded-xl border bg-card">
                {/* Vendor Header */}
                <div className="border-b px-6 py-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {vendorName}
                  </h3>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {vendorItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6">
                      {/* Image */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.variant && (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              Variant: {item.variant}
                            </p>
                          )}
                          <p className="mt-1 text-lg font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="inline-flex items-center rounded-lg border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-l-lg transition hover:bg-muted"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center border-x text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-r-lg transition hover:bg-muted"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => {
                              removeItem(item.id)
                              toast.success(t("itemRemoved"))
                            }}
                            className="flex items-center gap-1 text-sm text-red-500 transition hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link href="/products">
              <Button variant="outline">{t("continueShopping")}</Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-4 rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold">{t("orderSummary")}</h3>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">{t("couponCode")}</label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                  <Tag className="mr-1 h-4 w-4" />
                  {t("applyCoupon")}
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Amounts */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">{t("freeShipping")}</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("estimatedTax")} (15%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t("discount")}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full" size="lg">
                {t("proceedToCheckout")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
