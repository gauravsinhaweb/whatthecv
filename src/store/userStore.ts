import { create } from 'zustand'
import { UserProfile } from '../utils/types'

interface UserStore {
    user: UserProfile | null
    isAuthenticated: boolean
    loginError: string | null
    setUser: (user: UserProfile | null) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
    setLoginError: (error: string | null) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,
    loginError: null,
    setUser: (user) => set({ user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoginError: (error) => set({ loginError: error }),
    clearUser: () => set({ user: null, isAuthenticated: false, loginError: null }),
})) 