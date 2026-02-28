import { getTranslations } from "next-intl/server"
import { ShieldCheck, Truck, Headphones, CreditCard, Users, Package, Globe, Award } from "lucide-react"

export default async function AboutPage() {
  const t = await getTranslations("about")

  const features = [
    { icon: ShieldCheck, title: t("trustedVendors"), text: t("trustedVendorsText") },
    { icon: CreditCard, title: t("securePayments"), text: t("securePaymentsText") },
    { icon: Truck, title: t("fastDelivery"), text: t("fastDeliveryText") },
    { icon: Headphones, title: t("support247"), text: t("support247Text") },
  ]

  const stats = [
    { value: "5,000+", label: t("vendors"), icon: Users },
    { value: "100,000+", label: t("products"), icon: Package },
    { value: "1M+", label: t("customers"), icon: Award },
    { value: "15+", label: t("countries"), icon: Globe },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold">{t("ourStory")}</h2>
          <p className="text-center text-lg leading-relaxed text-muted-foreground">
            {t("ourStoryText")}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{t("ourMission")}</h3>
            <p className="leading-relaxed text-muted-foreground">{t("ourMissionText")}</p>
          </div>
          <div className="rounded-2xl border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{t("ourVision")}</h3>
            <p className="leading-relaxed text-muted-foreground">{t("ourVisionText")}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">{t("stats")}</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">{stat.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">{t("whyChooseUs")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-2xl border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
