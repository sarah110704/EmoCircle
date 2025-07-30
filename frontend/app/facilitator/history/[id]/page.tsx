"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, MessageSquare, ArrowLeft, LogOut, Copy } from "lucide-react"
import Link from "next/link"

interface Participant {
  name: string
  emotion?: string
  emotionLabel?: string
}

interface EmotionSummary {
  emotion: string
  percentage: number
  color: string
  emoji?: string
}

interface Reply {
  id: number
  content: string
}

interface Message {
  id: number
  content: string
  timestamp?: string
  replies: Reply[]
}

interface SessionDetail {
  id: number
  name: string
  code: string
  created_at: string
  participants: Participant[]
  messages: Message[]
  emotions: EmotionSummary[]
}

export default function SessionHistoryDetail() {
  const { id } = useParams()
  const [session, setSession] = useState<SessionDetail | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sessions/${id}`)
        const data = await res.json()

        if (data.session) {
          // Format tanggal saja (tanpa jam)
          const rawDate = data.session.created_at
          const formattedDate = new Date(rawDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          data.session.created_at = formattedDate
          setSession(data.session)
        }
      } catch (error) {
        console.error("Failed to fetch session detail:", error)
      }
    }

    fetchSession()
  }, [id])

  if (!session) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-[#FFA987] mr-3" />
              <span className="text-xl font-bold text-[#333333]">EmoCircle</span>
            </div>
            <Button variant="ghost" className="text-[#666666] hover:text-[#333333] hover:bg-gray-100">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link href="/facilitator/history" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#333333] mb-2">Session Report</h1>
            <p className="text-[#666666] text-lg">{session.name}</p>
          </div>
        </div>

        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#333333]">Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[#666666] text-sm mb-1">Date</p>
                <div className="flex items-center text-[#333333]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{session.created_at}</span>
                </div>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Session Code</p>
                <div className="flex items-center">
                  <span className="bg-[#F9FAFB] px-3 py-1 rounded font-mono text-[#333333] mr-2">
                    {session.code}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Participants</p>
                <div className="flex items-center text-[#333333]">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{session.participants?.length} people</span>
                </div>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Messages</p>
                <div className="flex items-center text-[#333333]">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>{session.messages?.length} messages</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Final Participant Emotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.participants?.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                      <span className="text-[#333333] font-medium">{participant.name}</span>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{participant.emotion || ""}</span>
                        <span className="text-[#666666] text-sm">{participant.emotionLabel || ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333]">Group Emotion Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.emotions?.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center w-24">
                        <span className="text-xl mr-2">{item.emoji || ""}</span>
                        <span className="text-[#666666] text-sm">{item.emotion}</span>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          >
                            <span className="text-white text-xs font-semibold">{item.percentage}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-[#333333] font-semibold text-sm text-right">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333]">Anonymous Messages & Replies</CardTitle>
                <p className="text-[#666666] text-sm">Read-only session transcript</p>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  {session.messages?.map((message) => (
                    <div key={message.id} className="border-l-4 border-[#A8E6CF] pl-4">
                      <div className="bg-[#F9FAFB] p-4 rounded-lg">
                        <p className="text-[#333333] mb-2">{message.content}</p>
                      </div>
                      {message.replies.map((reply, index) => (
                        <div key={index} className="ml-6 mt-3 bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-[#333333] text-sm mb-1">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
