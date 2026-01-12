import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { authApi } from '../services/auth.api';
import { SignupDTO } from '../types';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState<SignupDTO>({
        username: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authApi.signup(formData);
            // On success, maybe switch back to login or auto-login
            // Requirement: "Clicking “Log In” switches UI to logIn state on success" 
            // (This quote was for the OTHER direction or this one? "Clicking “Log In” switches UI to logIn state on success" is for the Log In button?
            // "Clicking “SignUp” switches UI back to signUp state"
            // Interpretation: Submit signup -> Success -> maybe auto login or show generic success.
            alert('Account created! Please log in.');
            onSwitchToLogin();
        } catch (err) {
            setError('Could not create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Create an account
                </h2>
                <p className="text-sm text-gray-500">
                    Start your journey with Qline today.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={isLoading}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
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
                    Sign Up
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}
