"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export function Footer() {
  const t = useTranslations("nav")
  const tHome = useTranslations("home")
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-2"
            >
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">
                {t("brand")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {tHome("footerDescription")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{tHome("quickLinks")}</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={`/${currentLocale}/products`} className="hover:text-foreground">
                {t("products")}
              </Link>
              <Link href={`/${currentLocale}/categories`} className="hover:text-foreground">
                {t("categories")}
              </Link>
              <Link href={`/${currentLocale}/vendors`} className="hover:text-foreground">
                {t("vendors")}
              </Link>
              <Link href={`/${currentLocale}/cart`} className="hover:text-foreground">
                {t("cart")}
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">{tHome("customerService")}</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={`/${currentLocale}/account`} className="hover:text-foreground">
                {t("account")}
              </Link>
              <Link href={`/${currentLocale}/account/orders`} className="hover:text-foreground">
                {t("myOrders")}
              </Link>
              <Link href={`/${currentLocale}/wishlist`} className="hover:text-foreground">
                {t("myWishlist")}
              </Link>
              <Link href={`/${currentLocale}/account/addresses`} className="hover:text-foreground">
                {t("myAddresses")}
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">{tHome("newsletterTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {tHome("newsletterSubtitle")}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={tHome("newsletterPlaceholder")}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                {tHome("subscribe")}
              </Button>
            </form>
          </div>
        </div>

        {/* Payment methods & copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SouqCart. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded border px-2 py-1 text-xs font-medium">
              VISA
            </span>
            <span className="rounded border px-2 py-1 text-xs font-medium">
              Mastercard
            </span>
            <span className="rounded border px-2 py-1 text-xs font-medium">
              PayPal
            </span>
            <span className="rounded border px-2 py-1 text-xs font-medium">
              Stripe
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
