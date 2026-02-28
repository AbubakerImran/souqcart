import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const couponSchema = z.object({
  code: z.string().min(1).transform(v => v.toUpperCase()),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrder: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  startDate: z.string().transform(v => new Date(v)),
  endDate: z.string().transform(v => new Date(v)),
  active: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coupon.count(),
    ])

    return NextResponse.json({
      success: true,
      data: coupons,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = couponSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({ data: parsed.data })

    return NextResponse.json({ success: true, data: coupon }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 })
  }
}
