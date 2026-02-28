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
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface Variant {
  id: string
  type: string
  value: string
  stock: number
  price: number
}

export default function NewProductPage() {
  const t = useTranslations("vendor")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const router = useRouter()
  const [variants, setVariants] = useState<Variant[]>([])
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(false)

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

  const handleSubmit = (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault()
    toast.success(asDraft ? t("saveAsDraft") : t("publish"))
    router.push(`/${locale}/vendor/products`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("addProduct")}</h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e, !published)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("productName")}</Label>
                    <Input placeholder="Product name in English" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productNameAr")}</Label>
                    <Input placeholder="اسم المنتج بالعربية" dir="rtl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("productDesc")}</Label>
                  <Textarea placeholder="Product description in English" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>{t("productDescAr")}</Label>
                  <Textarea placeholder="وصف المنتج بالعربية" rows={4} dir="rtl" />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{t("productPrice")}</Label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("comparePrice")}</Label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("costPrice")}</Label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{t("productSku")}</Label>
                    <Input placeholder="SKU-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("stockQty")}</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productWeight")}</Label>
                    <Input type="number" step="0.01" placeholder="0.0 kg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
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

            {/* Variants */}
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
                            placeholder="e.g. Size, Color"
                            value={variant.type}
                            onChange={(e) => updateVariant(variant.id, "type", e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>{t("variantValue")}</Label>
                          <Input
                            placeholder="e.g. Large, Red"
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="Select category" />
                </div>
                <div className="space-y-2">
                  <Label>{t("productTags")}</Label>
                  <Input placeholder="tag1, tag2, tag3" />
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
