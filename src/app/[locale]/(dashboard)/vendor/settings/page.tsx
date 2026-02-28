"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { toast } from "sonner"

export default function VendorSettingsPage() {
  const t = useTranslations("vendor")
  const tCommon = useTranslations("common")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("storeSettings")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("storeName")}</Label>
                <Input defaultValue="TechStore" />
              </div>
              <div className="space-y-2">
                <Label>{t("storeNameAr")}</Label>
                <Input defaultValue="متجر التقنية" dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("storeDesc")}</Label>
              <Textarea
                defaultValue="Premium tech accessories and gadgets for everyday use."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("storeDescAr")}</Label>
              <Textarea
                defaultValue="إكسسوارات وأجهزة تقنية متميزة للاستخدام اليومي."
                rows={4}
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("storeLogo")}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload store logo (recommended: 200x200px)</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("storeBanner")}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload store banner (recommended: 1200x400px)</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{tCommon("phone")}</Label>
                <Input defaultValue="+966 50 123 4567" />
              </div>
              <div className="space-y-2">
                <Label>{tCommon("email")}</Label>
                <Input defaultValue="store@techstore.com" type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{tCommon("address")}</Label>
              <Input defaultValue="123 Tech Avenue, Riyadh, Saudi Arabia" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">{tCommon("save")}</Button>
      </form>
    </div>
  )
}
