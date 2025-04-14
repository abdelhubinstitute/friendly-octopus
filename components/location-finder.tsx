"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LocationResult {
  name: string
  lat: number
  lon: number
}

interface LocationFinderProps {
  value: string
  onChange: (value: string) => void
  onSelect: (location: LocationResult) => void
}

export function LocationFinder({ value, onChange, onSelect }: LocationFinderProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchLocation = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      )
      const data = await response.json()

      const formattedResults: LocationResult[] = data.map((item: any) => ({
        name: item.display_name,
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
      }))

      setResults(formattedResults)
      setShowResults(true)
    } catch (error) {
      console.error("Error searching for location:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onChange(value)
  }

  const handleSelectLocation = (location: LocationResult) => {
    onSelect(location)
    setShowResults(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      searchLocation()
    }
  }

  return (
    <div className="relative">
      <div className="flex">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            placeholder="Search for a location..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && results.length > 0 && setShowResults(true)}
            className="pr-10 border-cyan-200 focus:border-cyan-400"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-cyan-500" />
            </div>
          )}
        </div>
        <Button type="button" onClick={searchLocation} className="ml-2 bg-cyan-600 hover:bg-cyan-700">
          <Search size={18} />
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-cyan-100 max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {results.map((result, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-cyan-50 cursor-pointer text-sm text-cyan-800"
                onClick={() => handleSelectLocation(result)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
