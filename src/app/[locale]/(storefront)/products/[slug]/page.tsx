import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { ProductCard } from "@/components/storefront/product-card"
import { ProductActions } from "./product-actions"

interface ProductData {
  id: string
  name: string
  nameAr: string | null
  slug: string
  description: string
  descriptionAr: string | null
  price: number
  comparePrice: number | null
  stock: number
  sku: string | null
  avgRating: number
  totalReviews: number
  totalSold: number
  tags: string[]
  images: { id: string; url: string; alt: string | null }[]
  variants: { id: string; name: string; type: string; value: string; price: number | null; stock: number }[]
  vendor: { id: string; storeName: string; slug: string; rating: number; logo: string | null }
  category: { id: string; name: string; slug: string } | null
  reviews: {
    id: string
    rating: number
    title: string | null
    comment: string
    createdAt: string
    user: { name: string | null; image: string | null }
  }[]
}

async function getProduct(slug: string): Promise<{ product: ProductData | null; related: ProductData[] }> {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        vendor: { select: { id: true, storeName: true, slug: true, rating: true, logo: true } },
        category: { select: { id: true, name: true, slug: true } },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true } } },
        },
      },
    })

    if (!product) {
      await prisma.$disconnect()
      return { product: null, related: [] }
    }

    const related = await prisma.product.findMany({
      where: {
        published: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        vendor: { select: { storeName: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
    })

    await prisma.$disconnect()

    return {
      product: {
        ...product,
        reviews: product.reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
      } as unknown as ProductData,
      related: related.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        image: p.images[0]?.url ?? null,
        vendorName: p.vendor.storeName,
        rating: p.avgRating,
        reviewCount: p.totalReviews,
      })) as unknown as ProductData[],
    }
  } catch {
    return { product: null, related: [] }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const t = await getTranslations("product")
  const { product, related } = await getProduct(params.slug)

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-4 rounded-full bg-muted p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Product Not Found</h2>
        <p className="mb-6 text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90">
          Browse Products
        </Link>
      </div>
    )
  }

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">{t("category") === "Category" ? "Products" : t("category")}</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
            {discount && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                -{discount}% {t("off")}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-muted transition hover:border-primary"
                >
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Vendor */}
          <Link
            href={`/vendors/${product.vendor.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            {product.vendor.logo ? (
              <Image src={product.vendor.logo} alt={product.vendor.storeName} width={24} height={24} className="rounded-full" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {product.vendor.storeName[0]}
              </div>
            )}
            {product.vendor.storeName}
          </Link>

          {/* Name */}
          <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.avgRating.toFixed(1)} ({product.totalReviews} {t("reviews")})
            </span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{product.totalSold} {t("sold")}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 10 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {t("inStock")}
              </span>
            ) : product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {t("lowStock")} — {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium">{t("selectVariant")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {variant.value}
                    {variant.price && variant.price !== product.price && (
                      <span className="ml-1 text-muted-foreground">(${variant.price.toFixed(2)})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Client Actions: Quantity + Add to Cart + Buy Now */}
          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0]?.url || "",
              stock: product.stock,
              vendorId: product.vendor.id,
              vendorName: product.vendor.storeName,
            }}
          />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">30-Day Returns</span>
            </div>
          </div>

          {/* SKU & Tags */}
          {product.sku && (
            <p className="text-sm text-muted-foreground">
              {t("sku")}: <span className="font-mono">{product.sku}</span>
            </p>
          )}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="mt-12">
        <div className="border-b">
          <div className="flex gap-8">
            <div className="border-b-2 border-primary pb-3 text-sm font-semibold text-primary">
              {t("description")}
            </div>
            <div className="pb-3 text-sm font-medium text-muted-foreground">
              {t("reviews")} ({product.totalReviews})
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm dark:prose-invert mt-6 max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h3 className="mb-6 text-xl font-bold">
            {t("reviews")} ({product.totalReviews})
          </h3>

          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border bg-card p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name || ""}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {(review.user.name || "A")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{review.user.name || "Anonymous"}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && <p className="mb-1 font-medium">{review.title}</p>}
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-8 text-center">
              <Star className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">{t("noReviews")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <ProductCard
                  product={{
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    comparePrice: p.comparePrice,
                    image: (p as unknown as { image?: string }).image ?? null,
                    vendorName: (p as unknown as { vendorName?: string }).vendorName,
                    rating: p.avgRating,
                    reviewCount: p.totalReviews,
                  }}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
