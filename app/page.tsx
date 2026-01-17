'use client';

import { AuthContainer } from '@/features/auth/components/AuthContainer';
import { useAuth } from '@/features/auth/context/auth-context';
import { Button } from '@/shared/ui/button';

export default function Home() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Render a loading spinner here
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <Button onClick={() => logout()} className="w-full">
            Sign Out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <AuthContainer />
    </main>
  );
}
