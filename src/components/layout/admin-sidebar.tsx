"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  FolderTree,
  Ticket,
  BarChart3,
  Settings,
} from "lucide-react"

const links = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/admin/users", icon: Users, labelKey: "users" as const },
  { href: "/admin/vendors", icon: Store, labelKey: "vendors" as const },
  { href: "/admin/products", icon: Package, labelKey: "products" as const },
  { href: "/admin/orders", icon: ShoppingCart, labelKey: "orders" as const },
  { href: "/admin/categories", icon: FolderTree, labelKey: "categories" as const },
  { href: "/admin/coupons", icon: Ticket, labelKey: "coupons" as const },
  { href: "/admin/analytics", icon: BarChart3, labelKey: "analytics" as const },
  { href: "/admin/settings", icon: Settings, labelKey: "settings" as const },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations("admin")

  const locale = pathname.split("/")[1] || "en"

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const fullHref = `/${locale}${link.href}`
        const isActive =
          link.href === "/admin"
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
