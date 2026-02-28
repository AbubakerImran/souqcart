"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { toast } from "sonner"

interface Category {
  id: string
  nameEn: string
  nameAr: string
  slug: string
  products: number
  parent?: string
}

const mockCategories: Category[] = [
  { id: "1", nameEn: "Electronics", nameAr: "إلكترونيات", slug: "electronics", products: 234 },
  { id: "2", nameEn: "Fashion", nameAr: "أزياء", slug: "fashion", products: 567 },
  { id: "3", nameEn: "Home & Garden", nameAr: "المنزل والحديقة", slug: "home-garden", products: 189 },
  { id: "4", nameEn: "Sports", nameAr: "رياضة", slug: "sports", products: 145 },
  { id: "5", nameEn: "Books", nameAr: "كتب", slug: "books", products: 320 },
  { id: "6", nameEn: "Food & Grocery", nameAr: "طعام وبقالة", slug: "food-grocery", products: 98 },
  { id: "7", nameEn: "Phones", nameAr: "هواتف", slug: "phones", products: 156, parent: "Electronics" },
  { id: "8", nameEn: "Laptops", nameAr: "حواسيب محمولة", slug: "laptops", products: 78, parent: "Electronics" },
]

export default function AdminCategoriesPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCategory: Category = {
      id: Date.now().toString(),
      nameEn: formData.get("nameEn") as string,
      nameAr: formData.get("nameAr") as string,
      slug: formData.get("slug") as string,
      products: 0,
      parent: (formData.get("parent") as string) || undefined,
    }
    setCategories([...categories, newCategory])
    setDialogOpen(false)
    toast.success(tCommon("success"))
  }

  const handleEditCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCategory) return
    const formData = new FormData(e.currentTarget)
    setCategories(categories.map((c) =>
      c.id === editingCategory.id
        ? {
            ...c,
            nameEn: formData.get("nameEn") as string,
            nameAr: formData.get("nameAr") as string,
            slug: formData.get("slug") as string,
            parent: (formData.get("parent") as string) || undefined,
          }
        : c
    ))
    setEditDialogOpen(false)
    setEditingCategory(null)
    toast.success(tCommon("success"))
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("manageCategories")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {t("addCategory")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addCategory")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("categoryName")}</Label>
                <Input name="nameEn" placeholder="Category name in English" required />
              </div>
              <div className="space-y-2">
                <Label>{t("categoryNameAr")}</Label>
                <Input name="nameAr" placeholder="اسم الفئة بالعربية" dir="rtl" required />
              </div>
              <div className="space-y-2">
                <Label>{t("categorySlug")}</Label>
                <Input name="slug" placeholder="category-slug" required />
              </div>
              <div className="space-y-2">
                <Label>{t("parentCategory")}</Label>
                <Input name="parent" placeholder="Optional parent category" />
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
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.nameEn}</TableCell>
                  <TableCell dir="rtl">{category.nameAr}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                  </TableCell>
                  <TableCell>{category.parent || "—"}</TableCell>
                  <TableCell>{category.products}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(category.id)}
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

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCategory")}</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("categoryName")}</Label>
                <Input name="nameEn" defaultValue={editingCategory.nameEn} required />
              </div>
              <div className="space-y-2">
                <Label>{t("categoryNameAr")}</Label>
                <Input name="nameAr" defaultValue={editingCategory.nameAr} dir="rtl" required />
              </div>
              <div className="space-y-2">
                <Label>{t("categorySlug")}</Label>
                <Input name="slug" defaultValue={editingCategory.slug} required />
              </div>
              <div className="space-y-2">
                <Label>{t("parentCategory")}</Label>
                <Input name="parent" defaultValue={editingCategory.parent || ""} placeholder="Optional parent category" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button type="submit">{tCommon("save")}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
