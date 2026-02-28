"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  const t = useTranslations("home")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="bg-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <Mail className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">
          {t("newsletterTitle")}
        </h2>
        <p className="mx-auto mb-6 max-w-md text-muted-foreground">
          {t("newsletterSubtitle")}
        </p>

        {submitted ? (
          <p className="font-medium text-primary">
            {t("subscribeSuccess")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md gap-2"
          >
            <Input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit">{t("subscribe")}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
