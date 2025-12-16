// src/lib/store/authStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                // Simple password check (replace with backend API later)
                const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

                if (password === validPassword) {
                    const user: AuthUser = {
                        email: email,
                        name: 'Admin User',
                        role: 'admin',
                        isAuthenticated: true,
                    };

                    set({ user, isAuthenticated: true });
                    return true;
                }

                return false;
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // localStorage key
        }
    )
);