import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              stripePaymentId: session.payment_intent as string,
            },
          })
        }
        break
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "FAILED" },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
