"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  UserCircle,
} from "lucide-react"

const links = [
  { href: "/account", icon: LayoutDashboard, labelKey: "overview" as const },
  { href: "/account/orders", icon: Package, labelKey: "orders" as const },
  { href: "/account/wishlist", icon: Heart, labelKey: "wishlist" as const },
  { href: "/account/addresses", icon: MapPin, labelKey: "addresses" as const },
  { href: "/account/profile", icon: UserCircle, labelKey: "profile" as const },
]

export function CustomerSidebar() {
  const pathname = usePathname()
  const t = useTranslations("account")

  const locale = pathname.split("/")[1] || "en"

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const fullHref = `/${locale}${link.href}`
        const isActive =
          link.href === "/account"
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
