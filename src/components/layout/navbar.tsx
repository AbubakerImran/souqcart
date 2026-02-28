"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  Globe,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react"

export function Navbar() {
  const t = useTranslations("nav")
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const switchLocale = currentLocale === "en" ? "ar" : "en"

  const handleLocaleSwitch = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${switchLocale}`)
    router.push(newPath)
  }

  const navLinks = [
    { href: `/${currentLocale}`, label: t("home") },
    { href: `/${currentLocale}/products`, label: t("products") },
    { href: `/${currentLocale}/categories`, label: t("categories") },
    { href: `/${currentLocale}/vendors`, label: t("vendors") },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="text-lg font-bold text-primary">
              {t("brand")}
            </SheetTitle>
            <nav className="mt-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">{t("brand")}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar */}
        <div className="hidden flex-1 items-center md:flex">
          <div className="relative mx-auto w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Language switcher */}
          <Button variant="ghost" size="icon" onClick={handleLocaleSwitch}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">{t("language")}</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">
              {theme === "dark" ? t("lightMode") : t("darkMode")}
            </span>
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${currentLocale}/wishlist`}>
              <Heart className="h-5 w-5" />
              <span className="sr-only">{t("wishlist")}</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href={`/${currentLocale}/cart`}>
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                0
              </span>
              <span className="sr-only">{t("cart")}</span>
            </Link>
          </Button>

          {/* User menu */}
          {session ? (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/${currentLocale}/account`}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("account")}</span>
                </Link>
              </Button>
              {session.user?.role === "VENDOR" && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/${currentLocale}/vendor/dashboard`}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="sr-only">{t("vendorDashboard")}</span>
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">{t("signOut")}</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${currentLocale}/auth/signin`}>{t("signIn")}</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
