import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import Negotiator from "negotiator"
import { match } from "@formatjs/intl-localematcher"

const locales = ["en", "ar"]
const defaultLocale = "en"

const protectedRoutes = ["dashboard", "meal-planner", "grocery-list"]
const authRoutes = ["login", "register"]

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = match(languages, locales, defaultLocale)
  return locale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  console.log("🕵️ Middleware — Path:", pathname)
  console.log("🍪 Token Present:", token ? "✅" : "❌")

  // ✅ 1. Redirect / → /{locale}
  if (pathname === "/") {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // ✅ 2. Skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // ✅ 3. Locale + Route Detection
  const segments = pathname.split("/").filter(Boolean)
  const locale = locales.includes(segments[0]) ? segments[0] : defaultLocale
  const subPath = segments[1] || ""

  const isProtected = protectedRoutes.includes(subPath)
  const isAuth = authRoutes.includes(subPath)

  // ✅ 4. Auth logic
  if (isProtected && !token) {
    console.log("🔒 Not Authenticated → Redirecting to login")
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuth && token) {
    console.log("✅ Already Logged In → Redirecting to dashboard")
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  console.log("✅ Access granted — continuing ➡️")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
