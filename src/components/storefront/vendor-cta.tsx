"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"

export function VendorCTA() {
  const t = useTranslations("home")

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-center text-white md:px-16">
        <Store className="mx-auto mb-4 h-12 w-12" />
        <h2 className="mb-3 text-2xl font-bold md:text-3xl">
          {t("vendorCTATitle")}
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-white/90">
          {t("vendorCTASubtitle")}
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/vendor/register">{t("vendorCTAButton")}</Link>
        </Button>
      </div>
    </section>
  )
}
