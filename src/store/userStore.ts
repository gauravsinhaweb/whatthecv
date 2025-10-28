import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '../utils/types'

interface UserStore {
    user: UserProfile | null
    isAuthenticated: boolean
    loginError: string | null
    isLoading: boolean
    setUser: (user: UserProfile | null) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
    setLoginError: (error: string | null) => void
    setIsLoading: (isLoading: boolean) => void
    clearUser: () => void
    clearError: () => void
    updateUser: (updates: Partial<UserProfile>) => void
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            loginError: null,
            isLoading: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            setLoginError: (error) => set({ loginError: error }),
            setIsLoading: (isLoading) => set({ isLoading }),
            clearUser: () => set({
                user: null,
                isAuthenticated: false,
                loginError: null,
                isLoading: false
            }),
            clearError: () => set({ loginError: null }),
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            }))
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
) 