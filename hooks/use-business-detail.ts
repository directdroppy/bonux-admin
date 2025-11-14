import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { SubscriptionTier, BusinessCategory } from '@/lib/supabase/types'

export interface BusinessDetail {
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
  subscription_tier: SubscriptionTier
  subscription_start_date: string
  subscription_end_date: string | null
  is_active: boolean
  total_campaigns: number
  active_campaigns: number
  total_redemptions: number
  monthly_scans: number
  created_at: string
}

export interface BusinessCampaign {
  id: string
  title: string
  campaign_type: string
  is_active: boolean
  total_redemptions: number
  start_date: string
  end_date: string | null
}

export function useBusinessDetail(businessId: string) {
  return useQuery({
    queryKey: ['business-detail', businessId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('businesses') as any)
        .select('*')
        .eq('id', businessId)
        .single()

      if (error) {
        throw error
      }

      return data as BusinessDetail
    },
    enabled: !!businessId,
  })
}

export function useBusinessCampaigns(businessId: string) {
  return useQuery({
    queryKey: ['business-campaigns', businessId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('campaigns') as any)
        .select('id, title, campaign_type, is_active, total_redemptions, start_date, end_date')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return (data || []) as BusinessCampaign[]
    },
    enabled: !!businessId,
  })
}
