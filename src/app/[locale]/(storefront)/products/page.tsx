import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"

async function getProducts(searchParams: Record<string, string | undefined>) {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const page = Number(searchParams.page) || 1
    const limit = 12
    const skip = (page - 1) * limit
    const search = searchParams.q || ""
    const sort = searchParams.sort || "newest"
    const categoryId = searchParams.category || undefined

    const where: Record<string, unknown> = { published: true }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const orderBy: Record<string, string> =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : sort === "popular"
            ? { totalSold: "desc" }
            : sort === "rating"
              ? { avgRating: "desc" }
              : { createdAt: "desc" }

    const [products, total, categories] = await Promise.all([
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
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ])

    await prisma.$disconnect()

    return {
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
      categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    }
  } catch {
    return { products: [], total: 0, totalPages: 0, currentPage: 1, categories: [] }
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const t = await getTranslations("product")
  const tc = await getTranslations("common")
  const tn = await getTranslations("nav")
  const data = await getProducts(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{tn("products")}</h1>
        <p className="mt-1 text-muted-foreground">
          {tc("showing")} {data.total} {tc("results")}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">{tc("filter")}</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">{tc("search")}</label>
              <form>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchParams.q || ""}
                  placeholder={tn("searchPlaceholder")}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </form>
            </div>

            {/* Categories */}
            {data.categories.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium">{t("category")}</h4>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block rounded-lg px-3 py-1.5 text-sm transition hover:bg-muted ${
                      !searchParams.category ? "bg-primary/10 font-medium text-primary" : ""
                    }`}
                  >
                    {tc("all")}
                  </Link>
                  {data.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className={`block rounded-lg px-3 py-1.5 text-sm transition hover:bg-muted ${
                        searchParams.category === cat.id
                          ? "bg-primary/10 font-medium text-primary"
                          : ""
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <div>
              <h4 className="mb-3 text-sm font-medium">{tc("sort")}</h4>
              <div className="space-y-2">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "popular", label: "Popular" },
                  { value: "rating", label: "Top Rated" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                ].map((option) => (
                  <Link
                    key={option.value}
                    href={`/products?${new URLSearchParams({
                      ...(searchParams.q ? { q: searchParams.q } : {}),
                      ...(searchParams.category ? { category: searchParams.category } : {}),
                      sort: option.value,
                    }).toString()}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition hover:bg-muted ${
                      (searchParams.sort || "newest") === option.value
                        ? "bg-primary/10 font-medium text-primary"
                        : ""
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
                      href={`/products?${new URLSearchParams({
                        ...(searchParams.q ? { q: searchParams.q } : {}),
                        ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                        ...(searchParams.category ? { category: searchParams.category } : {}),
                        page: String(data.currentPage - 1),
                      }).toString()}`}
                      className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      {tc("previous")}
                    </Link>
                  )}
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === data.totalPages ||
                        Math.abs(p - data.currentPage) <= 2
                    )
                    .map((p, i, arr) => (
                      <span key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-1 text-muted-foreground">...</span>
                        )}
                        <Link
                          href={`/products?${new URLSearchParams({
                            ...(searchParams.q ? { q: searchParams.q } : {}),
                            ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                            ...(searchParams.category ? { category: searchParams.category } : {}),
                            page: String(p),
                          }).toString()}`}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                            p === data.currentPage
                              ? "bg-primary text-primary-foreground"
                              : "border hover:bg-muted"
                          }`}
                        >
                          {p}
                        </Link>
                      </span>
                    ))}
                  {data.currentPage < data.totalPages && (
                    <Link
                      href={`/products?${new URLSearchParams({
                        ...(searchParams.q ? { q: searchParams.q } : {}),
                        ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                        ...(searchParams.category ? { category: searchParams.category } : {}),
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
              <div className="mb-4 rounded-full bg-muted p-6">
                <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">{tc("noResults")}</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
