import { getTranslations } from "next-intl/server"
import { HeroBanner } from "@/components/storefront/hero-banner"
import { TrustBadges } from "@/components/storefront/trust-badges"
import { FeaturedProducts } from "@/components/storefront/featured-products"
import { CategoryGrid } from "@/components/storefront/category-grid"
import { NewsletterSection } from "@/components/storefront/newsletter-section"
import { VendorCTA } from "@/components/storefront/vendor-cta"

async function getHomeData() {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { published: true, featured: true },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          vendor: { select: { storeName: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
      }),
      prisma.category.findMany({
        take: 8,
        orderBy: { name: "asc" },
      }),
    ])

    await prisma.$disconnect()

    return {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice,
        image: p.images[0]?.url ?? null,
        vendorName: p.vendor.storeName,
        rating: 0,
        reviewCount: 0,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
      })),
    }
  } catch (error) {
    console.error("Failed to fetch home data:", error)
    return { products: [], categories: [] }
  }
}

export default async function HomePage() {
  const t = await getTranslations("home")
  const { products, categories } = await getHomeData()

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <FeaturedProducts products={products} />
      <CategoryGrid categories={categories} />

      {/* Deals Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("todaysDeals")}
          </h2>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center text-white">
          <h3 className="mb-2 text-3xl font-bold">{t("todaysDeals")}</h3>
          <p className="mb-6 text-white/90">
            {t("dealsSubtitle")}
          </p>
          <div className="mb-6 flex items-center justify-center gap-4">
            {["12", "34", "56"].map((val, i) => (
              <div key={i} className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur">
                <span className="text-2xl font-bold">{val}</span>
                <span className="block text-xs">
                  {i === 0 ? t("hours") : i === 1 ? t("minutes") : t("seconds")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("newArrivals")}
          </h2>
          <a
            href="/products?sort=newest"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("viewAll")} →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.length > 0 ? (
            products
              .slice(0, 5)
              .map((product) => (
                <div
                  key={`new-${product.id}`}
                  className="rounded-xl border bg-card p-4 shadow-sm"
                >
                  <div className="mb-3 aspect-square rounded-lg bg-muted" />
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="mb-3 aspect-square animate-pulse rounded-lg bg-muted" />
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))
          )}
        </div>
      </section>

      <VendorCTA />
      <NewsletterSection />
    </>
  )
}
