import { Navbar } from "@/components/layout/navbar"
import { CustomerSidebar } from "@/components/layout/customer-sidebar"

export default function AccountLayout({
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
            <CustomerSidebar />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="md:hidden mb-4 overflow-x-auto">
            <CustomerSidebar />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
