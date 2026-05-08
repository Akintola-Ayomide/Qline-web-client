"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Plus } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useAuth } from "@/features/auth/context/auth-context"

/** Map route segments to human-readable titles */
const ROUTE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/queues": "Queues",
    "/dashboard/queues/create": "Create Queue",
    "/dashboard/analytics": "Analytics",
    "/dashboard/settings": "Settings",
    "/dashboard/help": "Help & Support",
}

export function Header() {
    const { user } = useAuth()
    const pathname = usePathname()

    const title = ROUTE_TITLES[pathname] ?? "Dashboard"

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search…"
                        className="h-10 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                </div>

                {/* Create Queue CTA */}
                <Link href="/dashboard/queues/create">
                    <Button className="gap-2 hidden sm:inline-flex">
                        <Plus className="h-4 w-4" />
                        New Queue
                    </Button>
                </Link>

                {/* Notifications */}
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5" />
                </button>

                {/* User avatar */}
                <Link href="/dashboard/settings">
                    <div
                        className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        title={user?.name ?? ""}
                    >
                        {user?.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </Link>
            </div>
        </header>
    )
}
