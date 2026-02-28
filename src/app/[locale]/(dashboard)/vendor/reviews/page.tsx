"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { formatDate } from "@/lib/utils"

const mockReviews = [
  {
    id: "1",
    product: "Wireless Headphones",
    customer: "Ahmed Ali",
    rating: 5,
    comment: "Excellent sound quality and very comfortable to wear. Battery life is amazing!",
    date: "2025-01-14",
  },
  {
    id: "2",
    product: "Smart Watch Pro",
    customer: "Sara Khan",
    rating: 4,
    comment: "Great watch with many features. The interface could be a bit more responsive.",
    date: "2025-01-12",
  },
  {
    id: "3",
    product: "USB-C Hub",
    customer: "Omar Hassan",
    rating: 5,
    comment: "Works perfectly with my MacBook. All ports function as expected.",
    date: "2025-01-10",
  },
  {
    id: "4",
    product: "Mechanical Keyboard",
    customer: "Fatima Ahmed",
    rating: 3,
    comment: "Good keyboard but a bit too loud for office use. Build quality is solid though.",
    date: "2025-01-08",
  },
  {
    id: "5",
    product: "Wireless Headphones",
    customer: "Youssef Salem",
    rating: 4,
    comment: "Very good headphones for the price. Noise cancellation works well.",
    date: "2025-01-05",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  )
}

export default function VendorReviewsPage() {
  const t = useTranslations("vendor")
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : ""
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("vendorReviews")}</h1>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.customer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.customer}</p>
                      <p className="text-sm text-muted-foreground">{review.product}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(review.date, locale)}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
