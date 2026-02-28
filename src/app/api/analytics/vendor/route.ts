import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor profile not found" }, { status: 404 })
    }

    const [
      totalProducts,
      publishedProducts,
      totalOrderItems,
      revenueResult,
      ratingResult,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { vendorId: vendor.id } }),
      prisma.product.count({ where: { vendorId: vendor.id, published: true } }),
      prisma.orderItem.count({ where: { vendorId: vendor.id } }),
      prisma.orderItem.aggregate({
        _sum: { price: true },
        where: {
          vendorId: vendor.id,
          order: { paymentStatus: "PAID" },
        },
      }),
      prisma.product.aggregate({
        _avg: { avgRating: true },
        where: { vendorId: vendor.id, totalReviews: { gt: 0 } },
      }),
      prisma.orderItem.findMany({
        where: { vendorId: vendor.id },
        take: 10,
        orderBy: { order: { createdAt: "desc" } },
        include: {
          order: { select: { id: true, orderNumber: true, status: true, createdAt: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      prisma.product.findMany({
        where: { vendorId: vendor.id },
        orderBy: { totalSold: "desc" },
        take: 5,
        select: { id: true, name: true, totalSold: true, avgRating: true, price: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        publishedProducts,
        totalOrderItems,
        totalRevenue: revenueResult._sum.price || 0,
        avgRating: ratingResult._avg.avgRating || 0,
        balance: vendor.balance,
        commissionRate: vendor.commissionRate,
        recentOrders,
        topProducts,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vendor analytics" }, { status: 500 })
  }
}
