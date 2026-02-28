"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { toast } from "sonner"

export default function AdminSettingsPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const [commissionRate, setCommissionRate] = useState("10")
  const [currency, setCurrency] = useState("USD")
  const [taxRate, setTaxRate] = useState("15")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("platformSettings")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("commissionRate")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("commissionRate")} (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Percentage of each sale that goes to the platform as commission.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("defaultCurrency")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("defaultCurrency")}</Label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                The default currency used across the platform (e.g., USD, SAR, AED).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("taxRate")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("taxRate")} (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Default tax rate applied to orders. Can be overridden per region.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit">{tCommon("save")}</Button>
      </form>
    </div>
  )
}
