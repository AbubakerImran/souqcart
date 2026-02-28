import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const wishlistSchema = z.object({
  productId: z.string().min(1),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { take: 1 },
            vendor: { select: { id: true, storeName: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: wishlist })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = wishlistSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } })
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const item = await prisma.wishlist.create({
      data: { userId: session.user.id, productId: parsed.data.productId },
    })

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ success: false, error: "Product already in wishlist" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to add to wishlist" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 })
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
    })

    return NextResponse.json({ success: true, data: { message: "Removed from wishlist" } })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to remove from wishlist" }, { status: 500 })
  }
}
