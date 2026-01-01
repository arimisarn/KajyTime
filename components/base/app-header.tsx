"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function AppHeader() {
  const { data: session } = useSession()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      {/* 🔘 BOUTON TOGGLE SIDEBAR */}
      <SidebarTrigger />

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-sm font-medium">
          Bienvenue {session?.user?.name}
        </h1>
      </div>
    </header>
  )
}
