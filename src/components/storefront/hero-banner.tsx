"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    gradient: "from-primary/90 to-primary/60",
    image: "/images/hero-1.jpg",
  },
  {
    id: 2,
    gradient: "from-blue-600/90 to-blue-400/60",
    image: "/images/hero-2.jpg",
  },
  {
    id: 3,
    gradient: "from-emerald-600/90 to-emerald-400/60",
    image: "/images/hero-3.jpg",
  },
]

export function HeroBanner() {
  const t = useTranslations("home")
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-r ${slides[current].gradient} transition-all duration-700`}
      >
        <div className="container mx-auto flex min-h-[500px] items-center px-4 py-20">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">{t("shopNow")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                asChild
              >
                <Link href="/vendor/register">{t("becomeVendor")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
