import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const updateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "VENDOR", "ADMIN"]).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Users can view their own profile, admins can view any
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true, name: true, email: true, image: true, role: true,
        phone: true, locale: true, createdAt: true, updatedAt: true,
        vendor: true,
        _count: { select: { orders: true, reviews: true, addresses: true, wishlists: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, phone: true },
    })

    return NextResponse.json({ success: true, data: user })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}
