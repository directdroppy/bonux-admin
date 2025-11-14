import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CampaignType } from '@/lib/supabase/types'

export interface CampaignFilter {
  search?: string
  type?: CampaignType
  isActive?: boolean
}

export interface Campaign {
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
  category: string
  created_at: string
}

export function useCampaigns(filters: CampaignFilter = {}) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => {
      const supabase = createClient()

      let query = (supabase
        .from('campaigns') as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.type) {
        query = query.eq('campaign_type', filters.type)
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return (data || []) as Campaign[]
    },
    staleTime: 1000 * 60,
  })
}
