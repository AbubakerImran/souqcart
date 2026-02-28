"use client"

import { useTranslations } from "next-intl"
import { Truck, Shield, Headphones, RotateCcw } from "lucide-react"

export function TrustBadges() {
  const t = useTranslations("home")

  const badges = [
    { icon: Truck, label: t("trustShipping") },
    { icon: Shield, label: t("trustPayment") },
    { icon: Headphones, label: t("trustSupport") },
    { icon: RotateCcw, label: t("trustReturns") },
  ]

  return (
    <section className="border-y bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 text-sm"
            >
              <badge.icon className="h-8 w-8 shrink-0 text-primary" />
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
