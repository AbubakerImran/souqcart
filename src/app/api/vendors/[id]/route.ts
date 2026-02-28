import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const updateVendorSchema = z.object({
  storeName: z.string().min(1).optional(),
  storeNameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  logo: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { products: true, orderItems: true } },
      },
    })

    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: vendor })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch vendor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const vendor = await prisma.vendor.findUnique({ where: { id: params.id } })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
    }

    if (vendor.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateVendorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const updated = await prisma.vendor.update({
      where: { id: params.id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update vendor" }, { status: 500 })
  }
}
