"use client"

import * as React from "react"
import { Clock, Users, ArrowUpRight, ArrowDownRight, Calendar, Download } from "lucide-react"
import { Button } from "@/shared/ui/button"

const MOCK_STATS = [
    { label: "Total Served", value: "1,284", change: "+12.5%", trend: "up", desc: "vs last month" },
    { label: "Avg Wait Time", value: "14m 30s", change: "-2m 15s", trend: "down", desc: "vs last month" },
    { label: "Peak Wait Time", value: "45m", change: "+5m", trend: "up", desc: "at 12:30 PM today" },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Gain insights into your queue performance and customer behavior.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Last 30 Days</span>
                    </div>
                    <Button variant="secondary" className="gap-2 bg-white">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_STATS.map((stat, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            <span className={`flex items-center text-sm font-medium ${stat.trend === "up" && stat.label !== "Avg Wait Time" ? "text-green-600" : stat.trend === "down" && stat.label === "Avg Wait Time" ? "text-green-600" : "text-red-600"}`}>
                                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4 mr-0.5" /> : <ArrowDownRight className="h-4 w-4 mr-0.5" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart Mock */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Traffic Trend</h3>
                    <div className="h-64 flex items-end gap-2">
                        {/* Mock bars */}
                        {[30, 45, 20, 60, 80, 50, 40, 70, 90, 85, 40, 30].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div 
                                    className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-600 transition-colors relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {h * 12}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                {/* Wait Time by Queue Mock */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Avg. Wait by Queue</h3>
                    <div className="space-y-4">
                        {[
                            { name: "General Inquiries", val: 85, time: "14m" },
                            { name: "Support Desk", val: 65, time: "10m" },
                            { name: "Billing", val: 95, time: "18m" },
                            { name: "Returns", val: 40, time: "5m" },
                        ].map((q, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-gray-700">{q.name}</span>
                                    <span className="text-gray-500">{q.time}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${q.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
