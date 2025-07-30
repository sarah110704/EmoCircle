"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Copy, StopCircle, Reply, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface EmotionSummary {
  emotion: string;
  percentage: number;
  color: string;
}

interface Participant {
  id: number;
  name: string;
  emotion: string;
  emotionLabel: string;
}

interface ReplyType {
  id: number;
  content: string;
  sender: string | null;
  created_at: string;
  timestamp: string;
}

interface Message {
  id: number;
  content: string;
  sender_name?: string | null;
  created_at: string;
  timestamp?: string;
  replies?: ReplyType[];
}

interface SessionDetail {
  id: number;
  code: string;
  name: string;
  status: string;
  created_at: string;
  participants?: Participant[];
  messages?: Message[];
  emotions?: EmotionSummary[];
}

export default function FacilitatorSessionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null);

  // Fetch session details, participants, and messages
  const fetchSessionDetail = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/${id}`);
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setMessages(data.session.messages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("❌ Gagal mengambil detail sesi:", error);
      toast.error("Gagal mengambil detail sesi.");
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/${id}/participants`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error("❌ Gagal mengambil peserta:", error);
    }
  };

  useEffect(() => {
    fetchSessionDetail();
    fetchParticipants();
    const interval = setInterval(() => {
      fetchSessionDetail();
      fetchParticipants();
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleReply = async (messageId: number) => {
    if (!replyText.trim()) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${messageId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: replyText,
        sender: null,
      }),
    });
    if (res.ok) {
      await fetchSessionDetail();
      setReplyText("");
      setShowReplyFor(null);
    }
  };

  const handleEndSession = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/${id}/end`, {
        method: "PUT", // Menggunakan PUT untuk mengubah status sesi
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal mengakhiri sesi");
      toast.success("Sesi berhasil diakhiri.");
      router.push("/facilitator/history"); // Mengarahkan ke halaman session history setelah sesi berakhir
    } catch (error) {
      toast.error("Gagal mengakhiri sesi.");
    }
  };

  const handleCopyCode = () => {
    if (session?.code) {
      navigator.clipboard.writeText(session.code);
      toast.success("Kode sesi berhasil disalin!");
    }
  };

  if (!session) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/facilitator/dashboard" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Heart className="w-6 h-6 text-[#FFA987] mr-2" />
              <span className="text-lg font-semibold text-[#333333]">{session.name}</span>
            </div>
            <Button
              onClick={handleEndSession}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Session Info */}
        <Card className="bg-white border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[#666666] text-sm">Session Code</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#333333] mr-2">{session.code}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-[#666666] text-sm">Participants</p>
                <p className="text-2xl font-bold text-[#333333]">{participants.length}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm">Status</p>
                <Badge className="bg-[#A8E6CF] text-[#333333]">{session.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#333333] flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                    <span className="text-[#333333] font-medium">{participant.name}</span>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{participant.emotion}</span>
                      <span className="text-[#666666] text-sm">{participant.emotionLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Group Emotion Chart */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#333333]">Group Emotion Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {session.emotions?.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 text-[#666666] text-sm">{item.emotion}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6">
                        <div
                          className="h-6 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-[#333333] font-semibold">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Anonymous Messages</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border-l-4 border-[#A8E6CF] pl-4">
                  <div className="bg-[#F9FAFB] p-4 rounded-lg">
                    <p className="text-[#333333] mb-2">{message.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666] text-xs">{message.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplyFor(showReplyFor === message.id ? null : message.id)}
                        className="text-[#FFA987] hover:text-[#FF9A7A]"
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>

                  {/* Replies */}
                  {message.replies?.map((reply, index) => (
                    <div key={index} className="ml-6 mt-2 bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-[#333333] text-sm mb-1">{reply.content}</p>
                      <span className="text-[#666666] text-xs">{reply.timestamp}</span>
                    </div>
                  ))}

                  {/* Reply Input */}
                  {showReplyFor === message.id && (
                    <div className="ml-6 mt-3 flex gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleReply(message.id)}
                        className="bg-[#FFA987] hover:bg-[#FF9A7A] text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
