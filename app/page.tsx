"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dateminders_auth")
    if (isAuthenticated === "true") {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "curiousoctopus") {
      localStorage.setItem("dateminders_auth", "true")
      router.push("/dashboard")
    } else {
      setError("Incorrect password. Try again.")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <OctopusLogo />
          </div>
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">Dateminders</h1>
          <p className="text-teal-700">Abdel & Daphne&apos;s Date Idea Ocean</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-xl font-medium text-center text-cyan-900 mb-6">Enter the Lagoon...</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pr-10 bg-white/70 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
            >
              Dive In
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-cyan-700">A private space for your shared adventures</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <WavesSVG />
      </div>
    </div>
  )
}

const OctopusLogo = () => <div className="text-6xl mb-2">🐙</div>

const WavesSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
    <path
      fill="rgba(6, 182, 212, 0.1)"
      d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,74.7C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
    />
    <path
      fill="rgba(6, 182, 212, 0.2)"
      d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
    />
  </svg>
)
