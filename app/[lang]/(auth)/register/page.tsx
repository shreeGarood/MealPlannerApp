"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"
import Link from "next/link"
import axios from "axios"

import { setCredentials } from "@/lib/redux/slices/authSlice"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { dictionaries } from "@/lib/i18n/client-dictionary"


export default function RegisterPage() {
  const { lang } = useParams() as { lang: "en" | "ar" }
  const dict = dictionaries[lang].register

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: dict.passwordMismatch,
        description: dict.error,
      })
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.post("/api/auth/register", { name, email, password })
      localStorage.setItem("token", data.token)
      dispatch(setCredentials({ user: data.user, token: data.token }))

      toast({ title: dict.success, description: dict.description })
      router.push(`/${lang}/dashboard`)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: dict.failed,
        description: error.response?.data?.message || dict.error,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{dict.title}</CardTitle>
          <CardDescription>{dict.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{dict.name}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{dict.email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{dict.password}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{dict.confirm}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dict.creating : dict.button}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {dict.haveAccount}{" "}
            <Link href={`/${lang}/login`} className="text-emerald-600 hover:underline dark:text-emerald-400">
              {dict.login}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
