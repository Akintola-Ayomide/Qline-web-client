import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { authApi } from '../services/auth.api';
import { LoginDTO } from '../types';

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState<LoginDTO>({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authApi.login(formData);
            // In a real app, we'd redirect or refresh user context here
            alert('Login Successful!');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p className="text-sm text-gray-500">
                    Welcome back! Please enter your details.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <Input
                        label="Email / Username"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                    />

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password-field" className="text-sm font-semibold text-gray-700 leading-none">
                                Password
                            </label>
                            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <Input
                                id="password-field"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={isLoading}
                                rightItem={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Checkbox
                        label="Remember me"
                        id="remember-me"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                >
                    Log In
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <button
                    onClick={onSwitchToSignup}
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
