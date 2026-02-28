import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"
import { Star, ShieldCheck, Store } from "lucide-react"

async function getVendors() {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const vendors = await prisma.vendor.findMany({
      where: { verified: true },
      orderBy: { rating: "desc" },
      include: { _count: { select: { products: true } } },
    })

    await prisma.$disconnect()

    return vendors.map((v) => ({
      id: v.id,
      storeName: v.storeName,
      storeNameAr: v.storeNameAr,
      slug: v.slug,
      description: v.description,
      logo: v.logo,
      banner: v.banner,
      rating: v.rating,
      totalSales: v.totalSales,
      verified: v.verified,
      productCount: v._count.products,
    }))
  } catch {
    return []
  }
}

export default async function VendorsPage() {
  const t = await getTranslations("vendors")
  const vendors = await getVendors()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
            >
              {/* Banner */}
              <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5">
                {vendor.banner && (
                  <Image src={vendor.banner} alt="" fill className="object-cover" />
                )}
              </div>

              {/* Content */}
              <div className="relative px-6 pb-6">
                {/* Logo */}
                <div className="-mt-10 mb-4 flex h-20 w-20 items-center justify-center rounded-xl border-4 border-background bg-card shadow-sm">
                  {vendor.logo ? (
                    <Image
                      src={vendor.logo}
                      alt={vendor.storeName}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <Store className="h-8 w-8 text-primary" />
                  )}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{vendor.storeName}</h3>
                      {vendor.verified && (
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    {vendor.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {vendor.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <span>·</span>
                  <span>{vendor.productCount} products</span>
                  <span>·</span>
                  <span>{vendor.totalSales} sales</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Store className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">{t("noVendors")}</h3>
          <p className="text-muted-foreground">{t("noVendorsMessage")}</p>
        </div>
      )}
    </div>
  )
}
