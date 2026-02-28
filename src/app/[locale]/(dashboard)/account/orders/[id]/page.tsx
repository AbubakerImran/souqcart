"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

const mockOrder = {
  id: "ord_1",
  number: "SC-ABC123",
  date: "2025-01-15",
  status: "shipped",
  total: 159.99,
  subtotal: 149.99,
  shipping: 10.0,
  tax: 0,
  paymentMethod: "Credit Card (**** 4242)",
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "Riyadh",
    country: "Saudi Arabia",
    phone: "+966 50 123 4567",
  },
  items: [
    { id: "1", name: "Wireless Headphones", price: 79.99, quantity: 1, image: "/placeholder.svg" },
    { id: "2", name: "Phone Case", price: 19.99, quantity: 2, image: "/placeholder.svg" },
    { id: "3", name: "USB-C Cable", price: 29.99, quantity: 1, image: "/placeholder.svg" },
  ],
  timeline: [
    { status: "placed", date: "2025-01-15T10:00:00Z", completed: true },
    { status: "processing", date: "2025-01-15T14:00:00Z", completed: true },
    { status: "shipped", date: "2025-01-16T09:00:00Z", completed: true },
    { status: "delivered", date: null, completed: false },
  ],
}

const statusIcons: Record<string, React.ReactNode> = {
  placed: <CheckCircle2 className="h-5 w-5" />,
  processing: <Clock className="h-5 w-5" />,
  shipped: <Truck className="h-5 w-5" />,
  delivered: <Package className="h-5 w-5" />,
}

export default function OrderDetailPage() {
  const t = useTranslations("account")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/account/orders`}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t("orders")}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("orderDetail")}</h1>
          <p className="text-muted-foreground">{mockOrder.number}</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          {mockOrder.status}
        </Badge>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderItems")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity, locale)}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(mockOrder.subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(mockOrder.shipping, locale)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-base">
                <span>{t("orderTotal")}</span>
                <span>{formatPrice(mockOrder.total, locale)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>{t("shippingAddress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{mockOrder.shippingAddress.name}</p>
              <p className="text-muted-foreground">{mockOrder.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.country}
              </p>
              <p className="text-muted-foreground">{mockOrder.shippingAddress.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t("paymentInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{mockOrder.paymentMethod}</p>
              <p className="text-muted-foreground">
                {t("orderDate")}: {formatDate(mockOrder.date, locale)}
              </p>
              <p className="text-muted-foreground">
                {t("orderTotal")}: {formatPrice(mockOrder.total, locale)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>{t("statusTimeline")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6 ps-8">
            {mockOrder.timeline.map((step, index) => (
              <div key={step.status} className="relative flex items-start gap-4">
                <div
                  className={`absolute start-[-32px] flex h-8 w-8 items-center justify-center rounded-full ${
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.completed ? statusIcons[step.status] || <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                {index < mockOrder.timeline.length - 1 && (
                  <div
                    className={`absolute start-[-16px] top-8 h-full w-0.5 ${
                      step.completed ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
                <div className="pt-1">
                  <p className="font-medium capitalize">{step.status}</p>
                  {step.date && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(step.date, locale)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
