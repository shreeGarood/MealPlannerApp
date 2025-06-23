"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { dictionaries } from "@/lib/i18n/client-dictionary"

export default function Home() {
  const params = useParams()
  const lang = (params?.lang ?? "en") as "en" | "ar"
  const dict = dictionaries[lang]?.home

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Translation not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500">
          {dict.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {dict.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="text-lg">
            <Link href={`/${lang}/login`}>{dict.login}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link href={`/${lang}/register`}>{dict.register}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">{dict.feature1.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{dict.feature1.desc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">{dict.feature2.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{dict.feature2.desc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">{dict.feature3.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{dict.feature3.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
