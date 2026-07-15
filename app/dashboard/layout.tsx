import { Sidebar } from "@/components/dashboard/sidebar"
import { Navbar } from "@/components/dashboard/navbar"
import { PageWrapper } from "@/components/animations/page-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">
          <PageWrapper>{children}</PageWrapper>
        </main>
      </div>
    </div>
  )
}
