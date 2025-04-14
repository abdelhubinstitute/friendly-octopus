"use client"

import { useState } from "react"
import { MapPin, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Archive, ArchiveRestore } from "lucide-react"
import type { DateIdea } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface DateCardProps {
  date: DateIdea
  onEdit: () => void
  onDelete: () => void
  onToggleComplete: () => void
  onToggleArchived: () => void
}

export function DateCard({ date, onEdit, onDelete, onToggleComplete, onToggleArchived }: DateCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = () => {
    setShowConfirmDelete(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowConfirmDelete(false)
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        date.completed ? "bg-cyan-50 border-cyan-200" : date.archived ? "bg-gray-50 border-gray-200" : "bg-white"
      }`}
    >
      <CardHeader className="p-4 pb-2 relative">
        {date.completed && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-teal-500">Completed</Badge>
          </div>
        )}

        {date.archived && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="text-gray-500 border-gray-300">
              Archived
            </Badge>
          </div>
        )}

        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleComplete}>
                {date.completed ? (
                  <>
                    <XCircle size={16} className="mr-2" />
                    Mark as Pending
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Completed
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleArchived}>
                {date.archived ? (
                  <>
                    <ArchiveRestore size={16} className="mr-2" />
                    Restore from Archive
                  </>
                ) : (
                  <>
                    <Archive size={16} className="mr-2" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash2 size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className={`text-lg ${date.archived ? "text-gray-700" : "text-cyan-800"}`}>{date.title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {date.location && (
          <div className="flex items-start gap-2 mb-2 text-sm">
            <MapPin size={16} className={date.archived ? "text-gray-400" : "text-cyan-500"} />
            <span className={date.archived ? "text-gray-600" : "text-cyan-700"}>
              {date.location}
              {date.coordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${date.coordinates.lat},${date.coordinates.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs underline inline-flex items-center"
                >
                  View on map
                </a>
              )}
            </span>
          </div>
        )}

        <p className={`text-sm mb-3 ${date.archived ? "text-gray-600" : "text-cyan-700"}`}>
          {date.description || "No description provided."}
        </p>

        {date.tags && date.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {date.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs ${date.archived ? "text-gray-500 border-gray-300" : "text-cyan-600 border-cyan-200"}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {showConfirmDelete && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={confirmDelete}>
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
