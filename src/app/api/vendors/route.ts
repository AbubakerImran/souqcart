import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const vendorSchema = z.object({
  storeName: z.string().min(1),
  storeNameAr: z.string().optional(),
  slug: z.string().min(1),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const verified = searchParams.get("verified")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (verified === "true") where.verified = true
    if (verified === "false") where.verified = false

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { products: true, orderItems: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.vendor.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: vendors,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.vendor.findUnique({ where: { userId: session.user.id } })
    if (existing) {
      return NextResponse.json({ success: false, error: "Vendor profile already exists" }, { status: 409 })
    }

    const body = await req.json()
    const parsed = vendorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const vendor = await prisma.vendor.create({
      data: { ...parsed.data, userId: session.user.id },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "VENDOR" },
    })

    return NextResponse.json({ success: true, data: vendor }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ success: false, error: "Vendor slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to register as vendor" }, { status: 500 })
  }
}
