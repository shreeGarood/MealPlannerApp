import type React from "react"
import Navbar from "@/components/navbar"
import AuthGuard from "@/components/auth-guard"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </AuthGuard>
  )
}
