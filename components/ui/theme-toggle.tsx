"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ size = "icon" as const }: { size?: "icon" | "sm" | "default" }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <Button variant="outline" size={size} onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
