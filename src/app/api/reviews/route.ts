import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(1),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (productId) where.productId = productId

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { productId, rating, title, comment } = parsed.data

    // Verify the user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: { in: ["DELIVERED", "CONFIRMED", "SHIPPED"] },
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json({ success: false, error: "You must purchase this product before reviewing" }, { status: 403 })
    }

    const review = await prisma.review.create({
      data: {
        rating,
        title,
        comment,
        verified: true,
        userId: session.user.id,
        productId,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    // Update product average rating
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ success: false, error: "You have already reviewed this product" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 })
  }
}
