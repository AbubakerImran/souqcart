"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Star,
  Settings,
} from "lucide-react"

const links = [
  { href: "/vendor", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/vendor/products", icon: Package, labelKey: "products" as const },
  { href: "/vendor/orders", icon: ShoppingCart, labelKey: "orders" as const },
  { href: "/vendor/analytics", icon: BarChart3, labelKey: "analytics" as const },
  { href: "/vendor/reviews", icon: Star, labelKey: "vendorReviews" as const },
  { href: "/vendor/settings", icon: Settings, labelKey: "storeSettings" as const },
]

export function VendorSidebar() {
  const pathname = usePathname()
  const t = useTranslations("vendor")

  const locale = pathname.split("/")[1] || "en"

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const fullHref = `/${locale}${link.href}`
        const isActive =
          link.href === "/vendor"
            ? pathname === fullHref
            : pathname.startsWith(fullHref)

        return (
          <Link
            key={link.href}
            href={fullHref}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            {t(link.labelKey)}
          </Link>
        )
      })}
    </nav>
  )
}
