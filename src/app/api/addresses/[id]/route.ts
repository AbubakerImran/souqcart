import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const updateAddressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().nullable().optional(),
  country: z.string().min(1).optional(),
  zipCode: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const address = await prisma.address.findUnique({ where: { id: params.id } })
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateAddressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.address.update({
      where: { id: params.id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const address = await prisma.address.findUnique({ where: { id: params.id } })
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 })
    }

    await prisma.address.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, data: { message: "Address deleted" } })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 })
  }
}
