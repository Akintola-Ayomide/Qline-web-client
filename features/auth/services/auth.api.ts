import { LoginDTO, SignupDTO, AuthResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
const USE_MOCK = true; // For demonstration purposes

async function mockDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authApi = {
    login: async (data: LoginDTO): Promise<AuthResponse> => {
        if (USE_MOCK) {
            await mockDelay(1500);
            // Simulate success
            return {
                user: { id: '1', name: 'Demo User', email: data.email },
                token: 'mock-jwt-token',
            };
        }

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    signup: async (data: SignupDTO): Promise<AuthResponse> => {
        if (USE_MOCK) {
            await mockDelay(1500);
            return {
                user: { id: '2', name: data.username, email: data.email },
                token: 'mock-jwt-token',
            };
        }

        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        return response.json();
    },
};
