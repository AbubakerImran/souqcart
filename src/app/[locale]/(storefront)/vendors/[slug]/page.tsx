import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"
import { Star, ShieldCheck, Store, MapPin } from "lucide-react"
import { ProductCard } from "@/components/storefront/product-card"

async function getVendorData(slug: string, searchParams: Record<string, string | undefined>) {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const vendor = await prisma.vendor.findUnique({
      where: { slug },
    })

    if (!vendor) {
      await prisma.$disconnect()
      return { vendor: null, products: [], total: 0, totalPages: 0, currentPage: 1 }
    }

    const page = Number(searchParams.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    const where = { published: true, vendorId: vendor.id }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          vendor: { select: { storeName: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ])

    await prisma.$disconnect()

    return {
      vendor: {
        id: vendor.id,
        storeName: vendor.storeName,
        storeNameAr: vendor.storeNameAr,
        slug: vendor.slug,
        description: vendor.description,
        descriptionAr: vendor.descriptionAr,
        logo: vendor.logo,
        banner: vendor.banner,
        city: vendor.city,
        country: vendor.country,
        rating: vendor.rating,
        totalSales: vendor.totalSales,
        verified: vendor.verified,
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
    return { vendor: null, products: [], total: 0, totalPages: 0, currentPage: 1 }
  }
}

export default async function VendorPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const t = await getTranslations("vendors")
  const tc = await getTranslations("common")
  const data = await getVendorData(params.slug, searchParams)

  if (!data.vendor) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <Store className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Vendor Not Found</h2>
        <p className="mb-6 text-muted-foreground">This vendor doesn&apos;t exist.</p>
        <Link href="/vendors" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">
          Browse Vendors
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Vendor Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 md:h-64">
        {data.vendor.banner && (
          <Image src={data.vendor.banner} alt="" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Vendor Info */}
        <div className="relative -mt-16 mb-8 flex flex-col gap-6 md:flex-row md:items-end">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-background bg-card shadow-lg">
            {data.vendor.logo ? (
              <Image
                src={data.vendor.logo}
                alt={data.vendor.storeName}
                width={96}
                height={96}
                className="rounded-xl object-cover"
              />
            ) : (
              <Store className="h-12 w-12 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold md:text-3xl">{data.vendor.storeName}</h1>
              {data.vendor.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("verified")}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{data.vendor.rating.toFixed(1)}</span>
              </div>
              <span>{data.total} products</span>
              <span>{data.vendor.totalSales} sales</span>
              {(data.vendor.city || data.vendor.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {[data.vendor.city, data.vendor.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
            {data.vendor.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">{data.vendor.description}</p>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="pb-12">
          <h2 className="mb-6 text-xl font-bold">{t("allProducts")}</h2>

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
                      href={`/vendors/${params.slug}?page=${data.currentPage - 1}`}
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
                      href={`/vendors/${params.slug}?page=${data.currentPage + 1}`}
                      className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      {tc("nextPage")}
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
              <h3 className="mb-2 text-lg font-medium">{tc("noResults")}</h3>
              <p className="text-muted-foreground">This vendor hasn&apos;t added products yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
