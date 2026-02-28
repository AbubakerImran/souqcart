"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SignInForm {
  email: string
  password: string
}

export default function SignInPage() {
  const t = useTranslations("auth")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>()

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true)
    try {
      // Simulate sign in
      console.log("Sign in:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Signed in successfully!")
    } catch {
      toast.error("Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("signIn")}</h1>
          <p className="mt-1 text-muted-foreground">{t("signInDescription")}</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {/* Google OAuth */}
          <Button variant="outline" className="w-full" size="lg" type="button">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("google")}
          </Button>

          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">{t("orContinueWith")}</span>
            <Separator className="flex-1" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{t("invalidEmail")}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                {...register("password", { required: true, minLength: 8 })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{t("passwordRequirements")}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : t("signIn")}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  )
}
