"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Filter, LogOut, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateCard } from "@/components/date-card"
import { DateForm } from "@/components/date-form"
import { type DateIdea, loadDates, saveDates } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [dates, setDates] = useState<DateIdea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingDate, setEditingDate] = useState<DateIdea | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dateminders_auth")
    if (isAuthenticated !== "true") {
      router.push("/")
    } else {
      // Load dates from localStorage
      setDates(loadDates())
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("dateminders_auth")
    router.push("/")
  }

  const handleSaveDate = (date: DateIdea) => {
    let updatedDates: DateIdea[]

    if (editingDate) {
      // Edit existing date
      updatedDates = dates.map((d) => (d.id === editingDate.id ? date : d))
    } else {
      // Add new date
      updatedDates = [...dates, date]
    }

    setDates(updatedDates)
    saveDates(updatedDates)
    setShowForm(false)
    setEditingDate(null)
  }

  const handleEditDate = (date: DateIdea) => {
    setEditingDate(date)
    setShowForm(true)
  }

  const handleDeleteDate = (id: string) => {
    const updatedDates = dates.filter((date) => date.id !== id)
    setDates(updatedDates)
    saveDates(updatedDates)
  }

  const handleToggleComplete = (id: string) => {
    const updatedDates = dates.map((date) => (date.id === id ? { ...date, completed: !date.completed } : date))
    setDates(updatedDates)
    saveDates(updatedDates)
  }

  const handleToggleArchived = (id: string) => {
    const updatedDates = dates.map((date) => (date.id === id ? { ...date, archived: !date.archived } : date))
    setDates(updatedDates)
    saveDates(updatedDates)
  }

  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter((t) => t !== tag))
    } else {
      setActiveFilters([...activeFilters, tag])
    }
  }

  // Get all unique tags from dates
  const allTags = Array.from(new Set(dates.flatMap((date) => date.tags || [])))

  // Filter dates based on active filters and tab
  const filterDates = (dates: DateIdea[], archived: boolean, completed?: boolean) => {
    return dates.filter((date) => {
      // Filter by archived status
      if (date.archived !== archived) return false

      // Filter by completion status if specified
      if (completed !== undefined && date.completed !== completed) return false

      // Filter by tags if any are selected
      if (activeFilters.length > 0) {
        if (!date.tags || date.tags.length === 0) return false
        return activeFilters.some((tag) => date.tags?.includes(tag))
      }

      return true
    })
  }

  const activeDates = filterDates(dates, false)
  const completedDates = filterDates(dates, false, true)
  const pendingDates = filterDates(dates, false, false)
  const archivedDates = filterDates(dates, true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🐙</div>
            <h1 className="text-2xl font-bold">Dateminders</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-1" />
              Filter
            </Button>

            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut size={18} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Filter tags */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-sm p-3 border-b border-cyan-100 shadow-sm">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-cyan-800">Filter by:</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeFilters.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeFilters.includes(tag) ? "bg-cyan-600 hover:bg-cyan-700" : "text-cyan-700 hover:bg-cyan-100"
                  }`}
                  onClick={() => toggleFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-cyan-700 h-7 px-2"
                  onClick={() => setActiveFilters([])}
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto p-4 pb-24">
        {showForm ? (
          <DateForm
            onSave={handleSaveDate}
            onCancel={() => {
              setShowForm(false)
              setEditingDate(null)
            }}
            editDate={editingDate}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cyan-800">Your Date Ideas</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
              >
                <Plus size={18} className="mr-1" />
                Add New Date
              </Button>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-white/50 border border-cyan-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  All ({activeDates.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Pending ({pendingDates.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  Completed ({completedDates.length})
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  Archived ({archivedDates.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {activeDates.length === 0 ? (
                  <EmptyState onAdd={() => setShowForm(true)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeDates.map((date) => (
                      <DateCard
                        key={date.id}
                        date={date}
                        onEdit={() => handleEditDate(date)}
                        onDelete={() => handleDeleteDate(date.id)}
                        onToggleComplete={() => handleToggleComplete(date.id)}
                        onToggleArchived={() => handleToggleArchived(date.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                {pendingDates.length === 0 ? (
                  <EmptyState onAdd={() => setShowForm(true)} message="No pending date ideas yet!" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingDates.map((date) => (
                      <DateCard
                        key={date.id}
                        date={date}
                        onEdit={() => handleEditDate(date)}
                        onDelete={() => handleDeleteDate(date.id)}
                        onToggleComplete={() => handleToggleComplete(date.id)}
                        onToggleArchived={() => handleToggleArchived(date.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {completedDates.length === 0 ? (
                  <EmptyState onAdd={() => setShowForm(true)} message="No completed dates yet!" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedDates.map((date) => (
                      <DateCard
                        key={date.id}
                        date={date}
                        onEdit={() => handleEditDate(date)}
                        onDelete={() => handleDeleteDate(date.id)}
                        onToggleComplete={() => handleToggleComplete(date.id)}
                        onToggleArchived={() => handleToggleArchived(date.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="archived" className="mt-6">
                {archivedDates.length === 0 ? (
                  <div className="text-center p-8 bg-white/60 rounded-lg border border-cyan-100">
                    <Archive className="mx-auto h-12 w-12 text-cyan-300 mb-3" />
                    <h3 className="text-lg font-medium text-cyan-800 mb-1">No archived date ideas</h3>
                    <p className="text-cyan-600 mb-4">Your archived date ideas will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archivedDates.map((date) => (
                      <DateCard
                        key={date.id}
                        date={date}
                        onEdit={() => handleEditDate(date)}
                        onDelete={() => handleDeleteDate(date.id)}
                        onToggleComplete={() => handleToggleComplete(date.id)}
                        onToggleArchived={() => handleToggleArchived(date.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* Footer with waves */}
      <footer className="fixed bottom-0 left-0 w-full">
        <WavesSVG />
      </footer>
    </div>
  )
}

const EmptyState = ({ onAdd, message = "No date ideas yet!" }) => (
  <div className="text-center p-8 bg-white/60 rounded-lg border border-cyan-100">
    <div className="text-6xl mx-auto mb-3">🐙</div>
    <h3 className="text-lg font-medium text-cyan-800 mb-1">{message}</h3>
    <p className="text-cyan-600 mb-4">Start adding your date ideas to create your ocean of adventures</p>
    <Button
      onClick={onAdd}
      className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
    >
      <Plus size={18} className="mr-1" />
      Add Your First Date Idea
    </Button>
  </div>
)

const OctopusIcon = () => <div className="text-4xl">🐙</div>

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
