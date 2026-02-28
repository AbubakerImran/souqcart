"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  Shirt,
  Smartphone,
  Home,
  Dumbbell,
  BookOpen,
  Baby,
  Gem,
  UtensilsCrossed,
} from "lucide-react"

const defaultCategories = [
  { slug: "fashion", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  {
    slug: "electronics",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
  },
  {
    slug: "home-garden",
    icon: Home,
    color: "bg-green-100 text-green-600",
  },
  {
    slug: "sports",
    icon: Dumbbell,
    color: "bg-orange-100 text-orange-600",
  },
  { slug: "books", icon: BookOpen, color: "bg-purple-100 text-purple-600" },
  { slug: "baby-kids", icon: Baby, color: "bg-yellow-100 text-yellow-600" },
  { slug: "jewelry", icon: Gem, color: "bg-rose-100 text-rose-600" },
  {
    slug: "food",
    icon: UtensilsCrossed,
    color: "bg-teal-100 text-teal-600",
  },
]

const categoryNames: Record<string, string> = {
  fashion: "Fashion",
  electronics: "Electronics",
  "home-garden": "Home & Garden",
  sports: "Sports & Fitness",
  books: "Books",
  "baby-kids": "Baby & Kids",
  jewelry: "Jewelry",
  food: "Food & Grocery",
}

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const t = useTranslations("home")

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 8)
      : defaultCategories.map((cat) => ({
          id: cat.slug,
          name: categoryNames[cat.slug] ?? cat.slug,
          slug: cat.slug,
          image: null,
        }))

  return (
    <section className="bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("shopByCategory")}
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {displayCategories.map((category) => {
            const fallback = defaultCategories.find(
              (d) => d.slug === category.slug
            )
            const Icon = fallback?.icon ?? Shirt
            const color = fallback?.color ?? "bg-gray-100 text-gray-600"

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 transition hover:shadow-md"
              >
                <div
                  className={`rounded-full p-4 ${color} transition group-hover:scale-110`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
