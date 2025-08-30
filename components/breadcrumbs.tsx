"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Crumb = { label: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-1 text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-foreground/80 transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "text-foreground" : "text-foreground/80")}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="mx-1 size-4 text-muted-foreground" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
