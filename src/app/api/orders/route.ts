import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const orderItemSchema = z.object({
  productId: z.string(),
  vendorId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  variant: z.string().optional(),
  image: z.string().optional(),
})

const createOrderSchema = z.object({
  addressId: z.string().optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  paymentMethod: z.string().default("stripe"),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    let where: Record<string, unknown> = {}

    if (session.user.role === "CUSTOMER") {
      where.userId = session.user.id
    } else if (session.user.role === "VENDOR") {
      const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } })
      if (vendor) {
        where.items = { some: { vendorId: vendor.id } }
      }
    }
    // ADMIN sees all orders

    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { items, shippingAddress, ...orderData } = parsed.data
    const orderNumber = `SC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        ...orderData,
        shippingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : undefined,
        orderNumber,
        userId: session.user.id,
        items: { create: items },
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
