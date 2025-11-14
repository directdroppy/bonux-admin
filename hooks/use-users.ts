import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { UserSegment } from '@/lib/supabase/types'

export interface UserFilter {
  search?: string
  segment?: UserSegment
  dateFrom?: string
  dateTo?: string
}

export interface User {
  id: string
  full_name: string
  email: string
  phone: string | null
  segment: UserSegment
  total_points: number
  total_savings: number
  referral_count: number
  created_at: string
  last_active_at: string | null
}

export function useUsers(filters: UserFilter = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const supabase = createClient()

      let query = (supabase
        .from('users') as any)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
      }

      if (filters.segment) {
        query = query.eq('segment', filters.segment)
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return (data || []) as User[]
    },
    staleTime: 1000 * 60, // 1 minute
  })
}
