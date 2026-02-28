import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"
import { Grid3X3, ShoppingBag } from "lucide-react"

async function getCategories() {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    })

    await prisma.$disconnect()

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      description: c.description,
      image: c.image,
      icon: c.icon,
      productCount: c._count.products,
    }))
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const t = await getTranslations("categories")
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm transition hover:shadow-md hover:border-primary/50"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary/20">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Grid3X3 className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="mb-1 font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.productCount} {category.productCount === 1 ? "product" : "products"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20">
          <div className="mb-4 rounded-full bg-muted p-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">{t("noCategories")}</h3>
          <p className="text-muted-foreground">{t("noCategoriesMessage")}</p>
        </div>
      )}
    </div>
  )
}
