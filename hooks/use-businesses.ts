import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { SubscriptionTier, BusinessCategory } from '@/lib/supabase/types'

export interface BusinessFilter {
  search?: string
  category?: BusinessCategory
  tier?: SubscriptionTier
  isActive?: boolean
}

export interface Business {
  id: string
  owner_id: string
  name: string
  email: string
  phone: string | null
  category: BusinessCategory
  address: string | null
  city: string | null
  logo_url: string | null
  description: string | null
  subscription_plan: string | null
  subscription_expires_at: string | null
  is_active: boolean
  total_campaigns: number
  active_campaigns: number
  total_redemptions: number
  monthly_scans_used: number
  created_at: string
}

export function useBusinesses(filters: BusinessFilter = {}) {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: async () => {
      const supabase = createClient()

      let query = (supabase
        .from('businesses') as any)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
      }

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.tier) {
        query = query.eq('subscription_plan', filters.tier)
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return (data || []) as Business[]
    },
    staleTime: 1000 * 60, // 1 minute
  })
}
