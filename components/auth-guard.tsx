"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { lang } = useParams() as { lang: "en" | "ar" }
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${lang}`)
    }
  }, [isAuthenticated, loading, lang, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
