import { getTranslations } from "next-intl/server"

export default async function TermsPage() {
  const t = await getTranslations("terms")

  const sections = [
    { title: t("acceptance"), text: t("acceptanceText") },
    { title: t("accounts"), text: t("accountsText") },
    { title: t("vendorTerms"), text: t("vendorTermsText") },
    { title: t("purchasing"), text: t("purchasingText") },
    { title: t("shipping"), text: t("shippingText") },
    { title: t("returns"), text: t("returnsText") },
    { title: t("ip"), text: t("ipText") },
    { title: t("limitation"), text: t("limitationText") },
    { title: t("changes"), text: t("changesText") },
    { title: t("contactUs"), text: t("contactUsText") },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>

        <div className="mt-8 rounded-2xl border bg-card p-8">
          <p className="mb-8 leading-relaxed text-muted-foreground">{t("intro")}</p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="mb-3 text-xl font-bold">
                  {index + 1}. {section.title}
                </h2>
                <p className="leading-relaxed text-muted-foreground">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
