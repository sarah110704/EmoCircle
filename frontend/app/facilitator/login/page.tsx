"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function FacilitatorLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`
, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login gagal")
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/facilitator/dashboard")
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="bg-white rounded-full p-4 shadow-lg inline-block mb-4">
              <Heart className="w-8 h-8 text-[#FFA987]" />
            </div>
          </Link>
        </div>

        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-[#333333]">Facilitator Login</CardTitle>
            <p className="text-[#666666] mt-2">Access your session dashboard</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-[#666666]" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-[#666666]" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-[#FFA987] text-white py-4 rounded-xl">
                Login
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-[#666666] text-sm">
                Don't have an account?{" "}
                <Link href="/facilitator/register" className="text-[#FFA987] font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
