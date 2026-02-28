import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const validateSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = validateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { code, orderTotal } = parsed.data

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 })
    }

    if (!coupon.active) {
      return NextResponse.json({ success: false, error: "Coupon is not active" }, { status: 400 })
    }

    const now = new Date()
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json({ success: false, error: "Coupon has expired or is not yet valid" }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 })
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount is ${coupon.minOrder}`,
      }, { status: 400 })
    }

    let discount = 0
    if (coupon.type === "PERCENTAGE") {
      discount = (orderTotal * coupon.value) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else {
      discount = coupon.value
    }

    discount = Math.min(discount, orderTotal)

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount * 100) / 100,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 })
  }
}
