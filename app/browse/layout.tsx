"use client"

import * as React from "react"
import { Sidebar } from "@/shared/ui/layout/Sidebar"
import { Header } from "@/shared/ui/layout/Header"

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="md:pl-64 flex flex-col min-h-screen relative z-10">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
