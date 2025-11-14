import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CampaignType } from '@/lib/supabase/types'

export interface CampaignDetail {
  id: string
  business_id: string
  business_name: string
  business_logo: string | null
  business_image: string | null
  title: string
  description: string | null
  campaign_type: CampaignType
  discount_value: number
  is_active: boolean
  start_date: string
  end_date: string | null
  total_redemptions: number
  max_redemptions_per_user: number | null
  point_cost: number | null
  min_purchase_amount: number | null
  max_discount_amount: number | null
  terms_and_conditions: string | null
  category: string
  created_at: string
  updated_at: string
}

export interface CampaignRedemption {
  id: string
  user_id: string
  redeemed_at: string
  discount_amount: number
  user_full_name: string
  user_email: string
}

export function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('campaigns') as any)
        .select('*')
        .eq('id', campaignId)
        .single()

      if (error) {
        throw error
      }

      return data as CampaignDetail
    },
    enabled: !!campaignId,
  })
}

export function useCampaignRedemptions(campaignId: string, limit = 50) {
  return useQuery({
    queryKey: ['campaign-redemptions', campaignId, limit],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('campaign_redemptions_with_users') as any)
        .select('*')
        .eq('campaign_id', campaignId)
        .order('redeemed_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return (data || []) as CampaignRedemption[]
    },
    enabled: !!campaignId,
  })
}
