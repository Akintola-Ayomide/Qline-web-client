'use client';

/**
 * @file app/auth/callback/page.tsx
 * @description Handles the redirect from the backend after a Google OAuth flow.
 *
 * Flow
 * ────
 * 1. Backend authenticates the user via Google.
 * 2. Backend sets an HttpOnly cookie AND redirects to:
 *      `FRONTEND_URL/auth/callback?token=<jwt>`
 *    The query param is the fallback for cross-domain production deployments
 *    where the backend cookie won't be visible to the frontend domain.
 * 3. This page reads the token from the URL, stores it via `handleGoogleCallback`,
 *    clears it from the URL (so it's not left in history), then redirects to
 *    the dashboard.
 * 4. If no token is found in the URL, the context's `checkAuth` may still
 *    succeed via the HttpOnly cookie (same-domain / dev scenarios).
 *
 * Race-condition prevention
 * ─────────────────────────
 * A local `isProcessing` state is set to `true` as soon as a URL token is
 * detected. This prevents the "cookie-fallback" useEffect from interpreting
 * the mid-flight state (isLoading=false, user=null) as a genuine auth failure
 * and prematurely redirecting to the error page.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function AuthCallbackInner() {
    const { user, isLoading, handleGoogleCallback } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const handled = useRef(false);

    /**
     * `isProcessing` stays true for the entire OAuth token-exchange round-trip.
     * It starts as true if a `?token=` param is present in the URL so that the
     * cookie-fallback effect is blocked right from the very first render.
     */
    const [isProcessing, setIsProcessing] = useState(() => {
        // Safely read searchParams during initialisation (client-only).
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).has('token');
        }
        return false;
    });

    // ── Effect 1: Handle cross-domain token in the URL ──────────────────────
    useEffect(() => {
        // Guard against running twice in React StrictMode
        if (handled.current) return;

        const token = searchParams.get('token');

        if (token) {
            handled.current = true;
            setIsProcessing(true);

            // Remove the token from the URL immediately (don't leave it in browser history).
            window.history.replaceState({}, '', '/auth/callback');

            handleGoogleCallback(token)
                .then(() => {
                    router.replace('/dashboard');
                })
                .catch(() => {
                    setIsProcessing(false);
                    router.replace('/auth?error=google_failed');
                });
        }
    }, [searchParams, handleGoogleCallback, router]);

    // ── Effect 2: Cookie-fallback (same-domain / dev) ───────────────────────
    // Only activate when:
    //   • We are NOT processing a URL token (isProcessing = false)
    //   • The URL has no token param
    //   • The AuthProvider has finished its initial checkAuth (isLoading = false)
    useEffect(() => {
        if (handled.current) return;  // Already handled via URL token above
        if (isProcessing) return;     // URL-token flow is in progress
        const token = searchParams.get('token');
        if (token) return;            // Will be handled by Effect 1

        if (!isLoading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                // Neither cookie nor token worked — auth genuinely failed.
                router.replace('/auth?error=google_failed');
            }
        }
    }, [user, isLoading, isProcessing, router, searchParams]);

    return (
        <main className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                    Completing sign-in…
                </p>
            </div>
        </main>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="flex h-screen w-full items-center justify-center bg-background">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </main>
            }
        >
            <AuthCallbackInner />
        </Suspense>
    );
}
