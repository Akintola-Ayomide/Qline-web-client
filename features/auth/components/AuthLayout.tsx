import * as React from 'react';
import { CircleAlert } from 'lucide-react'; // Approximating the "!" icon

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Branding Section */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-50 p-12 text-blue-900 relative overflow-hidden">
                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                    <CircleAlert className="text-blue-700 h-6 w-6" />
                    <span>Qline</span>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col items-center text-center max-w-lg mx-auto z-10">
                    <div className="mb-8 p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/40 shadow-xl">
                        <CircleAlert className="h-16 w-16 text-blue-700" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight mb-6 text-gray-900">
                        Smart Queue<br />Management
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        Streamline operations, enhance customer experience, and unlock efficiency with our intelligent queuing solutions.
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-sm text-slate-500 font-medium">
                    © 2024 Qline, Inc. All rights reserved.
                </div>

                {/* Decorative Grid/Glow (Optional for polish) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white relative">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>

                {/* Mobile Footer Links (if needed) or General Footer */}
                <div className="absolute bottom-6 right-8 flex gap-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-blue-600">Terms of Service</a>
                    <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                </div>
                <div className="lg:hidden absolute bottom-6 left-8 text-sm text-gray-500">
                    © 2024 Qline
                </div>
            </div>
        </div>
    );
}
