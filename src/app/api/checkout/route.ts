import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { z } from "zod"

const checkoutItemSchema = z.object({
  productId: z.string(),
  vendorId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  variant: z.string().optional(),
  image: z.string().optional(),
})

const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  addressId: z.string().optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  paymentMethod: z.enum(["stripe", "cod"]).default("stripe"),
  notes: z.string().optional(),
  locale: z.string().default("en"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { items, paymentMethod, locale, shippingAddress, ...orderData } = parsed.data
    const orderNumber = `SC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        ...orderData,
        shippingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : undefined,
        orderNumber,
        userId: session.user.id,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "PENDING" : "PENDING",
        status: paymentMethod === "cod" ? "CONFIRMED" : "PENDING",
        items: { create: items },
      },
      include: { items: true },
    })

    if (paymentMethod === "stripe") {
      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.NEXTAUTH_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/${locale}/cart`,
        metadata: { orderId: order.id },
      })

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: stripeSession.id },
      })

      return NextResponse.json({
        success: true,
        data: { orderId: order.id, url: stripeSession.url },
      })
    }

    // COD order
    return NextResponse.json({ success: true, data: { orderId: order.id } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process checkout" }, { status: 500 })
  }
}
