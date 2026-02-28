import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const t = await getTranslations("checkout")
  const orderNumber = searchParams.order || "SC-XXXXXX"

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
      {/* Success Animation */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="mb-2 text-3xl font-bold">{t("orderPlaced")}</h1>
      <p className="mb-8 text-center text-lg text-muted-foreground">{t("orderSuccess")}</p>

      {/* Order Details Card */}
      <div className="mb-8 w-full max-w-md rounded-2xl border bg-card p-8">
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
          <p className="mt-1 font-mono text-xl font-bold text-primary">{orderNumber}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{t("estimatedDelivery")}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            A confirmation email has been sent to your registered email address.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {t("continueShopping")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
