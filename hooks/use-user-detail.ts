import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { UserSegment } from '@/lib/supabase/types'

export interface UserDetail {
  id: string
  auth_id: string
  email: string
  phone: string | null
  full_name: string
  avatar_url: string | null
  segment: UserSegment
  segment_points: number
  total_points: number
  available_points: number
  spent_points: number
  total_savings: number
  daily_streak: number
  birth_date: string | null
  referral_code: string
  referral_count: number
  created_at: string
  last_active_at: string | null
}

export interface CampaignRedemption {
  id: string
  campaign_id: string
  redeemed_at: string
  discount_amount: number
  campaigns: {
    title: string
    business_name: string
  }
}

export interface RewardRedemption {
  id: string
  reward_id: string
  claimed_at: string
  points_spent: number
  rewards: {
    name: string
  }
}

export function useUserDetail(userId: string) {
  return useQuery({
    queryKey: ['user-detail', userId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('users') as any)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      return data as UserDetail
    },
    enabled: !!userId,
  })
}

export function useUserCampaignRedemptions(userId: string, limit = 10) {
  return useQuery({
    queryKey: ['user-campaign-redemptions', userId, limit],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('campaign_redemptions_with_users') as any)
        .select(`
          id,
          campaign_id,
          redeemed_at,
          discount_amount,
          campaigns (
            title,
            business_name
          )
        `)
        .eq('user_id', userId)
        .order('redeemed_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return (data || []) as CampaignRedemption[]
    },
    enabled: !!userId,
  })
}

export function useUserRewardRedemptions(userId: string, limit = 10) {
  return useQuery({
    queryKey: ['user-reward-redemptions', userId, limit],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await (supabase
        .from('reward_redemptions') as any)
        .select(`
          id,
          reward_id,
          claimed_at,
          points_spent,
          rewards (
            name
          )
        `)
        .eq('user_id', userId)
        .order('claimed_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return (data || []) as RewardRedemption[]
    },
    enabled: !!userId,
  })
}
