"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Menu, X } from "lucide-react"
import { Home, Search, LayoutGrid, HelpCircle, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { useScreenSize } from "@/hooks/use-screen-size"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import NavAuth from "@/components/auth/nav-auth"
import { ApolloProvider } from "@apollo/client/react"
import customClient from "@/client/client"

export default function WorkspacePagesLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useScreenSize();
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);
  
  return (
    <ApolloProvider client={customClient}>
      <div className="flex h-dvh flex-col overflow-hidden">
        {/* Mobile Header - Only show on mobile */}
        {isMobile && (
          <header className="flex h-14 items-center justify-between border-b px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile">
              <NavAuth />
            </Button>
          </div>
          </header>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Menu - Only show on mobile */}
          {isMobile && isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
                 onClick={() => setIsMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg" 
                   onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Link href="/workspace" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <Plus className="h-4 w-4" />
                      <span>New</span>
                    </Link>
                    <Link href="/home" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <LayoutGrid className="h-4 w-4" />
                      <span>Templates</span>
                    </Link>
                  </div>
                  
                  <div className="mt-auto space-y-1 pt-4 border-t">
                    <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Sidebar */}
          <aside className="hidden w-16 flex-col items-center gap-3 border-r px-2 py-4 md:flex">
            <Link href="/workspace">
              <Button variant="secondary" size="icon" className="rounded-full" aria-label="New">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
            <Separator className="my-1" />
            <Link href="/home">
              <IconButton icon={<Home className="h-4 w-4" />} label="Home" />
            </Link>
            <IconButton icon={<Search className="h-4 w-4" />} label="Search" />
            <IconButton icon={<LayoutGrid className="h-4 w-4" />} label="Templates" />
            <div className="mt-auto flex flex-col items-center gap-3">
              <ThemeToggle />
              <IconButton icon={<HelpCircle className="h-4 w-4" />} label="Help" />
              <IconButton icon={<Settings className="h-4 w-4" />} label="Settings" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <section className="h-full p-4 md:p-6">
              {children}
            </section>
          </main>
        </div>
        
        <Toaster />
      </div>
    </ApolloProvider>
  )
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label}>
        {icon}
      </Button>
    )
  }