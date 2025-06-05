import { create } from 'zustand'

interface UserProfile {
    id: string
    email: string
    name: string
    isVerified: boolean
    picture: string
}

interface UserStore {
    userProfile: UserProfile | null
    isAuthenticated: boolean
    loginError: string | null
    setUserProfile: (profile: UserProfile | null) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
    setLoginError: (error: string | null) => void
    reset: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    userProfile: null,
    isAuthenticated: false,
    loginError: null,
    setUserProfile: (profile) => set({ userProfile: profile }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoginError: (error) => set({ loginError: error }),
    reset: () => set({ userProfile: null, isAuthenticated: false, loginError: null }),
})) 