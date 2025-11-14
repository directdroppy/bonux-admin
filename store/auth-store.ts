import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminRole } from '@/lib/supabase/types'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: AdminRole
  permissions: string[]
}

interface AuthState {
  user: AdminUser | null
  isLoading: boolean
  setUser: (user: AdminUser | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
)
