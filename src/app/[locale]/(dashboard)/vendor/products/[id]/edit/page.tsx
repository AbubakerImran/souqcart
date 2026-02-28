"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface Variant {
  id: string
  type: string
  value: string
  stock: number
  price: number
}

// Mock pre-filled data
const mockProduct = {
  nameEn: "Wireless Headphones",
  nameAr: "سماعات لاسلكية",
  descEn: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
  descAr: "سماعات لاسلكية متميزة مع إلغاء الضوضاء وعمر بطارية 30 ساعة.",
  price: 79.99,
  comparePrice: 99.99,
  costPrice: 35.0,
  sku: "WH-001",
  stock: 45,
  weight: 0.3,
  category: "Electronics",
  tags: "wireless, headphones, audio",
  featured: true,
  published: true,
  variants: [
    { id: "1", type: "Color", value: "Black", stock: 25, price: 79.99 },
    { id: "2", type: "Color", value: "White", stock: 20, price: 79.99 },
  ],
}

export default function EditProductPage() {
  const t = useTranslations("vendor")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const router = useRouter()
  const [variants, setVariants] = useState<Variant[]>(mockProduct.variants)
  const [featured, setFeatured] = useState(mockProduct.featured)
  const [published, setPublished] = useState(mockProduct.published)

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now().toString(), type: "", value: "", stock: 0, price: 0 },
    ])
  }

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tCommon("success"))
    router.push(`/${locale}/vendor/products`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("editProduct")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("productName")}</Label>
                    <Input defaultValue={mockProduct.nameEn} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productNameAr")}</Label>
                    <Input defaultValue={mockProduct.nameAr} dir="rtl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("productDesc")}</Label>
                  <Textarea defaultValue={mockProduct.descEn} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>{t("productDescAr")}</Label>
                  <Textarea defaultValue={mockProduct.descAr} rows={4} dir="rtl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{t("productPrice")}</Label>
                    <Input type="number" step="0.01" defaultValue={mockProduct.price} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("comparePrice")}</Label>
                    <Input type="number" step="0.01" defaultValue={mockProduct.comparePrice} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("costPrice")}</Label>
                    <Input type="number" step="0.01" defaultValue={mockProduct.costPrice} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{t("productSku")}</Label>
                    <Input defaultValue={mockProduct.sku} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("stockQty")}</Label>
                    <Input type="number" defaultValue={mockProduct.stock} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productWeight")}</Label>
                    <Input type="number" step="0.01" defaultValue={mockProduct.weight} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("productImages")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("variants")}</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="h-4 w-4 me-2" />
                  {t("addVariant")}
                </Button>
              </CardHeader>
              <CardContent>
                {variants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No variants added yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {variants.map((variant) => (
                      <div key={variant.id} className="flex items-end gap-3">
                        <div className="flex-1 space-y-2">
                          <Label>{t("variantType")}</Label>
                          <Input
                            value={variant.type}
                            onChange={(e) => updateVariant(variant.id, "type", e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>{t("variantValue")}</Label>
                          <Input
                            value={variant.value}
                            onChange={(e) => updateVariant(variant.id, "value", e.target.value)}
                          />
                        </div>
                        <div className="w-24 space-y-2">
                          <Label>{t("variantStock")}</Label>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(variant.id, "stock", Number(e.target.value))}
                          />
                        </div>
                        <div className="w-28 space-y-2">
                          <Label>{t("variantPrice")}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => updateVariant(variant.id, "price", Number(e.target.value))}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive shrink-0"
                          onClick={() => removeVariant(variant.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input defaultValue={mockProduct.category} />
                </div>
                <div className="space-y-2">
                  <Label>{t("productTags")}</Label>
                  <Input defaultValue={mockProduct.tags} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" onClick={() => setPublished(true)}>
                {t("publish")}
              </Button>
              <Button type="submit" variant="outline" onClick={() => setPublished(false)}>
                {t("saveAsDraft")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
