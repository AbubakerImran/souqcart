import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  nameAr: z.string().optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  descriptionAr: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().nullable().optional(),
  cost: z.number().positive().nullable().optional(),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  lowStockAlert: z.number().int().min(0).optional(),
  weight: z.number().positive().nullable().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().nullable().optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        category: true,
        vendor: { select: { id: true, storeName: true, storeNameAr: true, slug: true, logo: true, verified: true, rating: true } },
      },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    await prisma.product.update({ where: { id: params.id }, data: { views: { increment: 1 } } })

    return NextResponse.json({ success: true, data: product })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { vendor: true } })
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const isOwner = product.vendor.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
      include: { images: true, category: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { vendor: true } })
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const isOwner = product.vendor.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    await prisma.product.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, data: { message: "Product deleted" } })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
