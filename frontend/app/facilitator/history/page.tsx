"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  Calendar,
  MessageSquare,
  Eye,
  ArrowLeft,
  LogOut,
  Search,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface HistorySession {
  id: number;
  name: string;
  created_at: string;
  code: string;
  participants: number;
  messages: number;
  emotions: {
    happy: number;
    neutral: number;
    worried: number;
    sad: number;
    excited: number;
  };
}

export default function SessionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [historySessions, setHistorySessions] = useState<HistorySession[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const facilitatorId = user.id;
        const res = await axios.get(
          `http://localhost:5000/api/sessions/history?facilitator_id=${facilitatorId}`
        );

        if (res.data.success) {
          setHistorySessions(res.data.sessions);
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch history sessions", err);
        alert("Failed to load session history.");
      }
    };
    fetchSessions();
  }, []);

  const emotionConfig = [
    { key: "happy", label: "Happy", emoji: "😊", color: "#FFD700" },
    { key: "excited", label: "Excited", emoji: "🤩", color: "#A8E6CF" },
    { key: "neutral", label: "Neutral", emoji: "😐", color: "#87CEEB" },
    { key: "worried", label: "Worried", emoji: "😟", color: "#FFA500" },
    { key: "sad", label: "Sad", emoji: "😔", color: "#FF6B6B" },
  ];

  const filteredSessions = historySessions.filter((session) =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-[#FFA987] mr-3" />
              <span className="text-xl font-bold text-[#333333]">EmoCircle</span>
            </div>
            <Button
              variant="ghost"
              className="text-[#666666] hover:text-[#333333] hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link href="/facilitator/dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#333333] mb-2">Session History</h1>
            <p className="text-[#666666] text-lg">
              Review past emotional tracking sessions
            </p>
          </div>
        </div>

        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search session by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFA987] focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            {searchQuery && (
              <div className="mt-3 text-sm text-[#666666]">
                Found {filteredSessions.length} session
                {filteredSessions.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-[#333333] mb-3">
                      {session.name}
                    </h3>
                    <div className="space-y-2 text-[#666666]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {session.created_at}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Code:</span>
                        <span className="bg-[#F9FAFB] px-2 py-1 rounded font-mono text-sm">
                          {session.code}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {session.participants} participants
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {session.messages} messages
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 flex items-center justify-end">
                    <Link href={`/facilitator/history/${session.id}`}>
                      <Button
                        variant="outline"
                        className="border-[#FFA987] text-[#FFA987] hover:bg-[#FFA987] hover:text-white transition-all duration-300 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <Search className="w-12 h-12 text-[#666666] mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-[#333333] mb-4">
              No sessions found
            </h3>
            <p className="text-[#666666] mb-8">
              No sessions match your search for "{searchQuery}"
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-[#FFA987] hover:bg-[#FF9A7A] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
