"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Camera, Send, LogOut, Reply } from "lucide-react"

export default function MemberSession() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [emotions, setEmotions] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [replyText, setReplyText] = useState("")
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null)
  const [currentEmotion, setCurrentEmotion] = useState({ emoji: "😊", label: "Happy" })

  // Retrieve sessionId and memberName correctly
  const sessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : null
  const memberName = typeof window !== "undefined" ? localStorage.getItem("memberName") : null

  useEffect(() => {
    if (!sessionId || !memberName) {
      router.push("/member/join")
      return
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sessions/${sessionId}`)
        const data = await res.json()
        if (data.success) {
          setSession(data.session)
          setParticipants(data.session.participants)
          setMessages(data.session.messages)
          setEmotions(data.session.emotions)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }

    fetchData()
  }, [sessionId, memberName]) // Re-run if sessionId or memberName changes

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const res = await fetch("http://localhost:5000/api/messages/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionId,
        content: message,
        senderName: null, // biar pesan anonim
      }),
    })

    const data = await res.json()
    if (data.success) {
      setMessage("")
      const refresh = await fetch(`http://localhost:5000/api/sessions/${sessionId}`)
      const newData = await refresh.json()
      if (newData.success) {
        setMessages(newData.session.messages)
      }
    }
  }

  const handleReply = async (messageId: number) => {
    if (!replyText.trim()) return

    const res = await fetch(`http://localhost:5000/api/messages/${messageId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: replyText,
        sender: null, // biar default
      }),
    })

    const data = await res.json()
    if (res.ok) {
      const updated = await fetch(`http://localhost:5000/api/sessions/${sessionId}`)
      const updatedData = await updated.json()
      if (updatedData.success) {
        setMessages(updatedData.session.messages)
      }
      setReplyText("")
      setShowReplyFor(null)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-[#A8E6CF] mr-2" />
              <div>
                <span className="text-lg font-semibold text-[#333333]">{session.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">Code: {session.code}</Badge>
              </div>
            </div>
            <Button
              onClick={() => {
                localStorage.clear()
                router.push("/")
              }}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Session
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Camera + Emotion */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Camera View</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2">{currentEmotion.emoji}</div>
                  <p className="text-xl font-semibold text-[#333333]">{currentEmotion.label}</p>
                  <p className="text-[#666666] text-sm">Your current detected emotion</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Participants + Chart + Messages */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {participants.map((p, index) => (
                    <div key={index} className="flex items-center p-3 bg-[#F9FAFB] rounded-lg">
                      <span className="text-2xl mr-3">{p.emotion || "😊"}</span>
                      <span className="text-[#333333] text-sm font-medium truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emotion Chart */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333]">Group Emotion Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emotions.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 text-[#666666] text-sm">{item.emotion}</div>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-4">
                          <div
                            className="h-4 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <div className="w-8 text-[#333333] font-semibold text-sm">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anonymous Messages */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333]">Anonymous Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="border-l-4 border-[#A8E6CF] pl-4">
                      <div className="bg-[#F9FAFB] p-3 rounded-lg">
                        <p className="text-[#333333] text-sm mb-2">{msg.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[#666666] text-xs">{msg.created_at || "Just now"}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReplyFor(showReplyFor === msg.id ? null : msg.id)}
                            className="text-[#A8E6CF] hover:text-[#9BDDC4] text-xs"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>

                      {/* Replies */}
                      {msg.replies?.map((reply: any) => (
                        <div key={reply.id} className="ml-6 mt-2 bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-[#333333] text-sm mb-1">{reply.content}</p>
                          <span className="text-[#666666] text-xs">{reply.created_at || "Just now"}</span>
                        </div>
                      ))}

                      {/* Reply Input */}
                      {showReplyFor === msg.id && (
                        <div className="ml-6 mt-3 flex gap-2">
                          <Input
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 text-sm"
                          />
                          <Button
                            onClick={() => handleReply(msg.id)}
                            className="bg-[#A8E6CF] hover:bg-[#9BDDC4] text-[#333333]"
                            size="sm"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Send an anonymous message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-[#A8E6CF] hover:bg-[#9BDDC4] text-[#333333]">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
