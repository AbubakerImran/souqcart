"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Truck, MapPin, ClipboardList, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { generateOrderNumber } from "@/lib/utils"
import Image from "next/image"

const STEPS = [
  { key: "step1Address", icon: MapPin },
  { key: "step2Shipping", icon: Truck },
  { key: "step3Payment", icon: CreditCard },
  { key: "step4Review", icon: ClipboardList },
] as const

export default function CheckoutPage() {
  const t = useTranslations("checkout")
  const tc = useTranslations("cart")
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)

  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  })
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  const subtotal = getTotal()
  const shippingCost = shippingMethod === "express" ? 9.99 : 0
  const tax = subtotal * 0.15
  const total = subtotal + shippingCost + tax

  const canProceed = () => {
    if (currentStep === 0) {
      return address.fullName && address.street && address.city && address.country
    }
    return true
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const orderNumber = generateOrderNumber()
    clearCart()
    router.push(`/checkout/success?order=${orderNumber}`)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add items to your cart before checking out.</p>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep
            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      isComplete
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/50"
                    }`}
                  >
                    {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t(step.key)}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-4 hidden h-0.5 flex-1 sm:block ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-6">
            {/* Step 1: Address */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t("step1Address")}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+966 50 000 0000"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="123 Main St"
                    className="mt-1"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Riyadh"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Saudi Arabia"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t("step2Shipping")}</h2>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      shippingMethod === "standard" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <p className="font-medium">{t("standardShipping")}</p>
                        <p className="text-sm text-muted-foreground">{t("standardDays")}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">Free</span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      shippingMethod === "express" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <div>
                        <p className="font-medium">{t("expressShipping")}</p>
                        <p className="text-sm text-muted-foreground">{t("expressDays")}</p>
                      </div>
                    </div>
                    <span className="font-bold">$9.99</span>
                  </label>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t("step3Payment")}</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "stripe" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="stripe" id="stripe" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("payWithStripe")}</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("cashOnDelivery")}</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">{t("step4Review")}</h2>

                {/* Address Summary */}
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("step1Address")}</h3>
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.city}
                    {address.state && `, ${address.state}`}
                    {address.zipCode && ` ${address.zipCode}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                  {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
                </div>

                {/* Shipping & Payment Summary */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("step2Shipping")}</h3>
                    <p className="font-medium">
                      {shippingMethod === "express" ? t("expressShipping") : t("standardShipping")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shippingMethod === "express" ? t("expressDays") : t("standardDays")}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("step3Payment")}</h3>
                    <p className="font-medium">
                      {paymentMethod === "cod" ? t("cashOnDelivery") : t("payWithStripe")}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-lg border">
                  <h3 className="border-b px-4 py-3 text-sm font-semibold text-muted-foreground">
                    Items ({items.length})
                  </h3>
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ChevronRight className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                {t("back")}
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  {t("next")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? t("processing") : t("placeOrder")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="sticky top-4 rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold">{tc("orderSummary")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tc("subtotal")}</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tc("shipping")}</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">{tc("freeShipping")}</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tc("tax")} (15%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>{tc("total")}</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
