'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Users, Calendar, Eye, LogOut, X } from "lucide-react";

interface Session {
  id: number;
  name: string;
  code: string;
  participants: number;
  status: "Active" | "Closed";
  date: string;
  time: string;
  created_at: string; // Pastikan ada properti created_at untuk tanggal
}

export default function FacilitatorDashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  const fetchSessions = async (status: string = "Active") => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/facilitator/login");
      return;
    }

    try {
      const userData = JSON.parse(user || "{}");
      const facilitator_id = userData.id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/sessions?facilitator_id=${facilitator_id}&status=${status}`,
        {
          method: "GET", 
          credentials: "include", // Pastikan untuk menyertakan kredensial
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Data received:", data);

      if (!data.sessions || !Array.isArray(data.sessions)) {
        setSessions([]);
        return;
      }

      setSessions(data.sessions); 
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setSessions([]);
    }
  };

  useEffect(() => {
    fetchSessions("Active"); // Menampilkan hanya sesi aktif
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const facilitator_id = user.id;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ name: newSessionName, facilitator_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setNewSessionName("");
      setShowCreateForm(false);
      fetchSessions(); // Re-fetch sessions after creation
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating session: " + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/"); 
  };

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
              onClick={handleLogout}
              variant="ghost"
              className="text-[#666666] hover:text-[#333333]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#333333] mb-2">Your Sessions</h1>
            <p className="text-[#666666] text-lg">Manage and monitor your emotional tracking sessions</p>
          </div>
          <div className="flex gap-4">
            <Link href="/facilitator/history">
              <Button className="bg-[#FFA987] hover:bg-[#FF9A7A] text-white">
                View Session History
              </Button>
            </Link>
            <Button onClick={() => setShowCreateForm(true)} className="bg-[#A8E6CF] text-[#333333]">
              <Plus className="w-5 h-5 mr-2" />
              Create New Session
            </Button>
          </div>
        </div>

        {showCreateForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Create New Session</h3>
                <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateSession} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Session Name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-[#A8E6CF] text-[#333333]">
                  Create
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {sessions.length > 0 ? (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between flex-col lg:flex-row">
                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-xl font-semibold mr-3">{session.name}</h3>
                        <Badge className={session.status === "Active" ? "bg-[#A8E6CF]" : "bg-gray-300"} >
                          {session.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-[#666666]">
                        <div className="mb-1">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {session.created_at} {/* Tampilkan hanya tanggal tanpa "at" */}
                        </div>
                        <div className="mb-1">
                          <strong>Code:</strong> {session.code}
                        </div>
                        <div>
                          <Users className="inline w-4 h-4 mr-1" />
                          {session.participants || 0} participants
                        </div>
                      </div>
                    </div>
                    <Link href={`/facilitator/session/${session.id}`}>
                      <Button className="mt-4 lg:mt-0 border border-[#FFA987] text-[#FFA987]">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#666666] mt-12">No sessions available. Create one now!</div>
        )}
      </div>
    </div>
  );
}
