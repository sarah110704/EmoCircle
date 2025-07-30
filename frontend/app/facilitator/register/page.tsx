"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function FacilitatorRegister() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registrasi gagal")
        return
      }

      router.push("/facilitator/login")
    } catch (err) {
      setError("Terjadi kesalahan saat registrasi")
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
            <CardTitle className="text-3xl font-bold text-[#333333]">Facilitator Register</CardTitle>
            <p className="text-[#666666] mt-2">Create your facilitator account</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-[#666666]" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl"
                  required
                />
              </div>
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
                Register
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-[#666666] text-sm">
                Already have an account?{" "}
                <Link href="/facilitator/login" className="text-[#FFA987] font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
