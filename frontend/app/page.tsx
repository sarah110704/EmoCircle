"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [sessionCode, setSessionCode] = useState("")
  const [memberName, setMemberName] = useState("")

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (sessionCode.trim() && memberName.trim()) {
      // Navigate to member session page
      window.location.href = `/member/session?code=${sessionCode}&name=${memberName}`
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Heart className="w-10 h-10 text-[#FFA987]" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#333333] mb-6">Welcome to EmoCircle</h1>
          <p className="text-xl md:text-2xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
            Join or create a session to track emotions in real time.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Facilitator Option */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-10 text-center">
              <div className="mb-8">
                <div className="bg-[#FFF5F2] rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-[#FFA987]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-4">Lead a Session</h3>
                <p className="text-[#666666] text-lg mb-8">
                  Create and facilitate emotional tracking sessions for your team or group.
                </p>
              </div>
              <Link href="/facilitator/login">
                <Button className="w-full bg-[#FFA987] hover:bg-[#FF9A7A] text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                  I'm a Facilitator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Member Option */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <div className="bg-[#F0FDF4] rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-[#A8E6CF]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-4">Join a Session</h3>
                <p className="text-[#666666] text-lg mb-8">
                  Enter your session details to participate in emotional tracking.
                </p>
              </div>

              {!showMemberForm ? (
                <Button
                  onClick={() => setShowMemberForm(true)}
                  className="w-full bg-[#A8E6CF] hover:bg-[#9BDDC4] text-[#333333] font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  I'm a Member
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <form onSubmit={handleJoinSession} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Session Code"
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A8E6CF] focus:border-transparent transition-all duration-200 text-lg"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A8E6CF] focus:border-transparent transition-all duration-200 text-lg"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#A8E6CF] hover:bg-[#9BDDC4] text-[#333333] font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    Join Session
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-[#666666] text-lg">
            Experience emotional awareness in a supportive, real-time environment
          </p>
        </div>
      </div>
    </div>
  )
}
