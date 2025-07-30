"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

interface Session {
  id: number;
  code: string;
  name: string;
  status: string;
  created_at: string;
  participants: Participant[];
  emotions: EmotionSummary[];
}

export default function MemberSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionCode = searchParams.get("code");
  const memberName = searchParams.get("name");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/details_by_code?code=${sessionCode}`);
        if (!res.ok) {
          throw new Error('Failed to fetch session details');
        }

        const data = await res.json();
        if (data.success) {
          setSession(data.session);
          setParticipants(data.session.participants);
        } else {
          console.error("Session not found", data);
          router.push("/");  // Redirect if session not found
        }
      } catch (error) {
        console.error("❌ Error fetching session data", error);
      }
    };

    if (sessionCode) fetchSessionData();
  }, [sessionCode]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/member/join">
              <Button variant="ghost" size="sm">
                ← Back to Join
              </Button>
            </Link>
            <Heart className="w-6 h-6 text-[#FFA987] mr-2" />
            <span className="text-lg font-semibold text-[#333333]">{session?.name}</span>
          </div>
        </div>
      </div>

      {session ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-white border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[#666666] text-sm">Session Code</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#333333] mr-2">{session.code}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#666666] text-sm">Participants</p>
                  <p className="text-2xl font-bold text-[#333333]">{participants.length}</p>
                </div>
                <div>
                  <p className="text-[#666666] text-sm">Status</p>
                  <span className="bg-[#A8E6CF] text-[#333333]">{session.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      ) : (
        <div className="p-8">Loading...</div>
      )}
    </div>
  );
}
