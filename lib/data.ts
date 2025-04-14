export interface DateIdea {
  id: string
  title: string
  description?: string
  location?: string
  coordinates?: {
    lat: number
    lon: number
  } | null
  tags?: string[]
  completed: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
}

// Load dates from localStorage
export const loadDates = (): DateIdea[] => {
  if (typeof window === "undefined") return []

  const savedDates = localStorage.getItem("dateminders_dates")
  if (savedDates) {
    try {
      return JSON.parse(savedDates)
    } catch (error) {
      console.error("Error parsing saved dates:", error)
      return []
    }
  }
  return []
}

// Save dates to localStorage
export const saveDates = (dates: DateIdea[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("dateminders_dates", JSON.stringify(dates))
  } catch (error) {
    console.error("Error saving dates:", error)
  }
}
