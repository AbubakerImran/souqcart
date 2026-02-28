import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import { ChevronRight } from "lucide-react"

async function getCategoryProducts(slug: string, searchParams: Record<string, string | undefined>) {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: true },
    })

    if (!category) {
      await prisma.$disconnect()
      return { category: null, products: [], total: 0, totalPages: 0, currentPage: 1 }
    }

    const page = Number(searchParams.page) || 1
    const limit = 12
    const skip = (page - 1) * limit
    const sort = searchParams.sort || "newest"

    const orderBy: Record<string, string> =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : sort === "popular"
            ? { totalSold: "desc" }
            : { createdAt: "desc" }

    const where = { published: true, categoryId: category.id }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          vendor: { select: { storeName: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ])

    await prisma.$disconnect()

    return {
      category: {
        id: category.id,
        name: category.name,
        nameAr: category.nameAr,
        slug: category.slug,
        description: category.description,
        image: category.image,
        children: category.children.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      },
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        image: p.images[0]?.url ?? null,
        vendorName: p.vendor.storeName,
        rating: p.avgRating,
        reviewCount: p.totalReviews,
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }
  } catch {
    return { category: null, products: [], total: 0, totalPages: 0, currentPage: 1 }
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const t = await getTranslations("categories")
  const tc = await getTranslations("common")
  const data = await getCategoryProducts(params.slug, searchParams)

  if (!data.category) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <h2 className="mb-2 text-2xl font-bold">Category Not Found</h2>
        <p className="mb-6 text-muted-foreground">This category doesn&apos;t exist.</p>
        <Link href="/categories" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">
          Browse Categories
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories" className="hover:text-primary">{t("title")}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{data.category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{data.category.name}</h1>
        {data.category.description && (
          <p className="mt-2 text-muted-foreground">{data.category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {data.total} {tc("results")}
        </p>
      </div>

      {/* Subcategories */}
      {data.category.children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {data.category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* Sort */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium">{tc("sort")}:</span>
        {[
          { value: "newest", label: "Newest" },
          { value: "popular", label: "Popular" },
          { value: "price-asc", label: "Price ↑" },
          { value: "price-desc", label: "Price ↓" },
        ].map((option) => (
          <Link
            key={option.value}
            href={`/categories/${params.slug}?sort=${option.value}`}
            className={`rounded-lg px-3 py-1.5 text-sm transition hover:bg-muted ${
              (searchParams.sort || "newest") === option.value
                ? "bg-primary/10 font-medium text-primary"
                : ""
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {/* Products */}
      {data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {data.currentPage > 1 && (
                <Link
                  href={`/categories/${params.slug}?${new URLSearchParams({
                    ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                    page: String(data.currentPage - 1),
                  }).toString()}`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  {tc("previous")}
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                {tc("page")} {data.currentPage} {tc("of")} {data.totalPages}
              </span>
              {data.currentPage < data.totalPages && (
                <Link
                  href={`/categories/${params.slug}?${new URLSearchParams({
                    ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                    page: String(data.currentPage + 1),
                  }).toString()}`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  {tc("nextPage")}
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20">
          <h3 className="mb-2 text-lg font-medium">{tc("noResults")}</h3>
          <p className="mb-6 text-muted-foreground">No products in this category yet.</p>
          <Link href="/products" className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            {t("allProducts")}
          </Link>
        </div>
      )}
    </div>
  )
}
