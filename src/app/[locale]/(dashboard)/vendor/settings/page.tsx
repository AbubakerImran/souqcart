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
  const [storeName, setStoreName] = useState("TechStore")
  const [storeNameAr, setStoreNameAr] = useState("متجر التقنية")
  const [storeDesc, setStoreDesc] = useState("Premium tech accessories and gadgets for everyday use.")
  const [storeDescAr, setStoreDescAr] = useState("إكسسوارات وأجهزة تقنية متميزة للاستخدام اليومي.")
  const [phone, setPhone] = useState("+966 50 123 4567")
  const [email, setEmail] = useState("store@techstore.com")
  const [address, setAddress] = useState("123 Tech Avenue, Riyadh, Saudi Arabia")

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
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("storeNameAr")}</Label>
                <Input value={storeNameAr} onChange={(e) => setStoreNameAr(e.target.value)} dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("storeDesc")}</Label>
              <Textarea
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("storeDescAr")}</Label>
              <Textarea
                value={storeDescAr}
                onChange={(e) => setStoreDescAr(e.target.value)}
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
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{tCommon("email")}</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{tCommon("address")}</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">{tCommon("save")}</Button>
      </form>
    </div>
  )
}
