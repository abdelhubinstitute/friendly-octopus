"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DateIdea } from "@/lib/data"
import { LocationFinder } from "@/components/location-finder"
import { Badge } from "@/components/ui/badge"

interface DateFormProps {
  onSave: (date: DateIdea) => void
  onCancel: () => void
  editDate?: DateIdea | null
}

const SUGGESTED_TAGS = [
  "Foodie 🍽️",
  "Outdoors 🌳",
  "Arts & Culture 🎭",
  "Relaxing 🧘",
  "Free ✨",
  "Adventure 🧗",
  "Romantic ❤️",
  "Seasonal 🍂",
]

export function DateForm({ onSave, onCancel, editDate }: DateFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")

  useEffect(() => {
    if (editDate) {
      setTitle(editDate.title || "")
      setDescription(editDate.description || "")
      setLocation(editDate.location || "")
      setCoordinates(editDate.coordinates || null)
      setTags(editDate.tags || [])
    }
  }, [editDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dateIdea: DateIdea = {
      id: editDate?.id || uuidv4(),
      title,
      description,
      location,
      coordinates,
      tags,
      completed: editDate?.completed || false,
      archived: editDate?.archived || false,
      createdAt: editDate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(dateIdea)
  }

  const handleLocationSelect = (locationData: { name: string; lat: number; lon: number }) => {
    setLocation(locationData.name)
    setCoordinates({ lat: locationData.lat, lon: locationData.lon })
  }

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()])
      setCustomTag("")
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-800">{editDate ? "Edit Date Idea" : "Add New Date Idea"}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-cyan-700">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Sunset Kayaking Adventure 🛶"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-cyan-200 focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-cyan-700">
              Location
            </Label>
            <LocationFinder value={location} onChange={setLocation} onSelect={handleLocationSelect} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-cyan-700">
              Description/Notes
            </Label>
            <Textarea
              id="description"
              placeholder="Add details, why it's appealing, links, opening times, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-cyan-200 focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700">Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {SUGGESTED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    tags.includes(tag) ? "bg-cyan-600 hover:bg-cyan-700" : "text-cyan-700 hover:bg-cyan-100"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCustomTag} className="border-cyan-200 text-cyan-700">
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-cyan-700 mb-1">Selected tags:</p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="bg-cyan-600 flex items-center gap-1 pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full bg-cyan-700/20 hover:bg-cyan-700/40 text-white p-0"
                        onClick={() => toggleTag(tag)}
                      >
                        <X size={10} />
                        <span className="sr-only">Remove {tag}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} className="border-cyan-200 text-cyan-700">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
          >
            {editDate ? "Save Changes" : "Add Date Idea"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
