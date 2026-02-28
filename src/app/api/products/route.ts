import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  slug: z.string().min(1),
  description: z.string().min(1),
  descriptionAr: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  weight: z.number().positive().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().default(0),
  })).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const vendor = searchParams.get("vendor")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("rating")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (category) where.categoryId = category
    if (vendor) where.vendorId = vendor
    if (featured === "true") where.featured = true
    if (published !== "false") where.published = true

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      }
    }

    if (rating) {
      where.avgRating = { gte: parseFloat(rating) }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameAr: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: "desc" }
    if (sort) {
      switch (sort) {
        case "price_asc": orderBy = { price: "asc" }; break
        case "price_desc": orderBy = { price: "desc" }; break
        case "rating": orderBy = { avgRating: "desc" }; break
        case "newest": orderBy = { createdAt: "desc" }; break
        case "popular": orderBy = { totalSold: "desc" }; break
        case "views": orderBy = { views: "desc" }; break
      }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: true, category: true, vendor: { select: { id: true, storeName: true, slug: true, logo: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor profile not found" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { images, ...productData } = parsed.data

    const product = await prisma.product.create({
      data: {
        ...productData,
        vendorId: vendor.id,
        images: images ? { create: images } : undefined,
      },
      include: { images: true, category: true },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ success: false, error: "Product slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
