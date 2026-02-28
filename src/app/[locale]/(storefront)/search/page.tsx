import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import { Search } from "lucide-react"

async function searchProducts(query: string) {
  if (!query) return []
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const products = await prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { nameAr: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      take: 24,
      orderBy: { totalSold: "desc" },
      include: {
        vendor: { select: { storeName: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
    })

    await prisma.$disconnect()

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      comparePrice: p.comparePrice,
      image: p.images[0]?.url ?? null,
      vendorName: p.vendor.storeName,
      rating: p.avgRating,
      reviewCount: p.totalReviews,
    }))
  } catch {
    return []
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const t = await getTranslations("search")
  const query = searchParams.q || ""
  const products = await searchProducts(query)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <div className="mx-auto mb-10 max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold">{t("title")}</h1>
        <form className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder={t("placeholder")}
            className="w-full rounded-xl border bg-background py-4 pl-12 pr-4 text-lg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        </form>
      </div>

      {/* Results */}
      {query && (
        <div className="mb-6">
          <h2 className="text-lg text-muted-foreground">
            {t("resultsFor")} <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
            <span className="ml-2 text-sm">({products.length} products found)</span>
          </h2>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">{t("noResults")}</h3>
          <p className="mb-6 max-w-md text-center text-muted-foreground">{t("noResultsMessage")}</p>
          <Link href="/products" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Start typing to search for products
          </h3>
        </div>
      )}
    </div>
  )
}
