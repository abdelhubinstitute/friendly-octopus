// Simple authentication functions

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  return localStorage.getItem("dateminders_auth") === "true"
}

// Authenticate user
export const authenticate = (): void => {
  if (typeof window === "undefined") return

  localStorage.setItem("dateminders_auth", "true")
}

// Logout user
export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("dateminders_auth")
}
