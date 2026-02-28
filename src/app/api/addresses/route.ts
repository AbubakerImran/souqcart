import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const addressSchema = z.object({
  label: z.string().default("Home"),
  fullName: z.string().min(1),
  phone: z.string().optional(),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json({ success: true, data: addresses })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = addressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    // If setting as default, unset other defaults
    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: { ...parsed.data, userId: session.user.id },
    })

    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create address" }, { status: 500 })
  }
}
