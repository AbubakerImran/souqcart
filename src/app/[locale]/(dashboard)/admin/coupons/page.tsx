"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { toast } from "sonner"

interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  maxDiscount: number
  usageLimit: number
  used: number
  startDate: string
  endDate: string
  active: boolean
}

const mockCoupons: Coupon[] = [
  { id: "1", code: "WINTER25", type: "percentage", value: 25, minOrder: 50, maxDiscount: 100, usageLimit: 500, used: 234, startDate: "2025-01-01", endDate: "2025-03-31", active: true },
  { id: "2", code: "FLAT10", type: "fixed", value: 10, minOrder: 30, maxDiscount: 10, usageLimit: 1000, used: 567, startDate: "2025-01-01", endDate: "2025-12-31", active: true },
  { id: "3", code: "NEWUSER", type: "percentage", value: 15, minOrder: 0, maxDiscount: 50, usageLimit: 0, used: 890, startDate: "2024-01-01", endDate: "2025-12-31", active: true },
  { id: "4", code: "SUMMER20", type: "percentage", value: 20, minOrder: 75, maxDiscount: 80, usageLimit: 300, used: 300, startDate: "2024-06-01", endDate: "2024-08-31", active: false },
]

export default function AdminCouponsPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: (formData.get("code") as string).toUpperCase(),
      type: formData.get("type") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      minOrder: Number(formData.get("minOrder")),
      maxDiscount: Number(formData.get("maxDiscount")),
      usageLimit: Number(formData.get("usageLimit")),
      used: 0,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      active: true,
    }
    setCoupons([...coupons, newCoupon])
    setDialogOpen(false)
    toast.success(tCommon("success"))
  }

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id))
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("manageCoupons")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {t("addCoupon")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("addCoupon")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("couponCode")}</Label>
                <Input name="code" placeholder="e.g. SAVE20" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("couponType")}</Label>
                  <Select name="type" defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("couponValue")}</Label>
                  <Input name="value" type="number" step="0.01" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("couponMinOrder")}</Label>
                  <Input name="minOrder" type="number" step="0.01" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label>{t("couponMaxDiscount")}</Label>
                  <Input name="maxDiscount" type="number" step="0.01" defaultValue="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("couponUsageLimit")}</Label>
                <Input name="usageLimit" type="number" defaultValue="0" placeholder="0 = unlimited" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("couponStartDate")}</Label>
                  <Input name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>{t("couponEndDate")}</Label>
                  <Input name="endDate" type="date" required />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button type="submit">{tCommon("create")}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Used / Limit</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <code className="font-bold bg-muted px-2 py-1 rounded text-sm">{coupon.code}</code>
                  </TableCell>
                  <TableCell className="capitalize">{coupon.type}</TableCell>
                  <TableCell>
                    {coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value, locale)}
                  </TableCell>
                  <TableCell>{formatPrice(coupon.minOrder, locale)}</TableCell>
                  <TableCell>
                    {coupon.used} / {coupon.usageLimit || "∞"}
                  </TableCell>
                  <TableCell>{formatDate(coupon.endDate, locale)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        coupon.active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {coupon.active ? tCommon("active") : tCommon("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
