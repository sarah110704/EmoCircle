import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SessionEnded() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Session Ended Card */}
        <Card className="bg-white border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="bg-[#F0FDF4] rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-[#A8E6CF] mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-[#333333] mb-4">This Session Has Ended</h1>
              <p className="text-lg text-[#666666] mb-8">Thank you for participating in EmoCircle.</p>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-[#A8E6CF] hover:bg-[#9BDDC4] text-[#333333] font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-[#FFA987] mr-2" />
            <span className="text-[#666666]">EmoCircle</span>
          </div>
          <p className="text-[#666666] text-sm">Building emotional awareness through technology</p>
        </div>
      </div>
    </div>
  )
}
