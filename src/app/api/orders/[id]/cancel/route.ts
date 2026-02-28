import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ success: false, error: "Only pending orders can be cancelled" }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
      include: { items: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to cancel order" }, { status: 500 })
  }
}
