import { Navbar } from "@/components/layout/navbar"
import { VendorSidebar } from "@/components/layout/vendor-sidebar"

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <aside className="sticky top-20 z-30 -ml-2 hidden md:block">
          <div className="rounded-lg border bg-card p-4">
            <VendorSidebar />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-auto">
          <div className="md:hidden mb-4 overflow-x-auto">
            <VendorSidebar />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
