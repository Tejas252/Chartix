"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { Home, Search, LayoutGrid, HelpCircle, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import NavAuth from "@/components/auth/nav-auth"
import { ApolloProvider } from "@apollo/client/react"
import customClient from "@/client/client"

export default function WorkspacePagesLayout({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={customClient}>
  <main className="flex h-dvh overflow-hidden">
  {/* Left dock */}
  <aside
    className={`hidden w-16 flex-col items-center gap-3 border-r px-2 py-4 md:flex`}
  >
    <Link href="/workspace">
    <Button variant="secondary" size="icon" className="rounded-full" aria-label="New">
      <Plus className="h-4 w-4" />
    </Button>
    </Link>
    <Separator className="my-1" />
    <IconButton icon={<Home className="h-4 w-4" />} label="Home" />
    <IconButton icon={<Search className="h-4 w-4" />} label="Search" />
    <IconButton icon={<LayoutGrid className="h-4 w-4" />} label="Templates" />
    <div className="mt-auto flex flex-col items-center gap-3">
    <ThemeToggle />
      <IconButton icon={<HelpCircle className="h-4 w-4" />} label="Help" />
      <IconButton icon={<NavAuth />} label="Profile" />
      <IconButton icon={<Settings className="h-4 w-4" />} label="Settings" />
    </div>
  </aside>

  {/* Main content */}
  <section className="flex h-full flex-1 gap-6 overflow-hidden p-4 md:p-6">
      {children}
  </section>
  <Toaster />
</main>
  </ApolloProvider>
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label}>
        {icon}
      </Button>
    )
  }