import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SouqCart - Multi-Vendor E-Commerce",
  description: "Your premier multi-vendor e-commerce platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
