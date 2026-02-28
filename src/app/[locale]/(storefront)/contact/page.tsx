"use client"

import { useTranslations } from "next-intl"
import { MapPin, Mail, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast.success(t("success"))
    ;(e.target as HTMLFormElement).reset()
  }

  const contactInfo = [
    { icon: MapPin, title: t("office"), text: t("officeAddress") },
    { icon: Mail, title: t("emailUs"), text: "support@souqcart.com" },
    { icon: Phone, title: t("callUs"), text: "+966 11 000 0000" },
    { icon: Clock, title: t("workingHours"), text: t("workingHoursText") },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-2">
          {contactInfo.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex gap-4 rounded-xl border bg-card p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" placeholder="John Doe" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-1" required />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="subject">{t("subject")}</Label>
              <Input id="subject" placeholder="How can we help?" className="mt-1" required />
            </div>
            <div className="mt-4">
              <Label htmlFor="message">{t("message")}</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder="Your message..."
                className="mt-1 resize-none"
                required
              />
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={isLoading}>
              {isLoading ? t("sending") : t("send")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
