'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, Store, Tag, QrCode, TrendingUp, Gift } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalBusinesses: number
  totalCampaigns: number
  totalRedemptions: number
  totalSavings: number
  totalRewards: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalCampaigns: 0,
    totalRedemptions: 0,
    totalSavings: 0,
    totalRewards: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        // Fetch counts (type assertions needed for Supabase type inference)
        const [
          { count: usersCount },
          { count: businessesCount },
          { count: campaignsCount },
          { count: redemptionsCount },
          { data: savingsData },
          { count: rewardsCount },
        ] = await Promise.all([
          (supabase.from('users') as any).select('*', { count: 'exact', head: true }),
          (supabase.from('businesses') as any).select('*', { count: 'exact', head: true }),
          (supabase.from('campaigns') as any).select('*', { count: 'exact', head: true }).eq('is_active', true),
          (supabase.from('campaign_redemptions') as any).select('*', { count: 'exact', head: true }),
          (supabase.from('users') as any).select('total_savings'),
          (supabase.from('reward_redemptions') as any).select('*', { count: 'exact', head: true }),
        ])

        // Calculate total savings
        const totalSavings = savingsData?.reduce((sum: number, user: any) => sum + (user.total_savings || 0), 0) || 0

        setStats({
          totalUsers: usersCount || 0,
          totalBusinesses: businessesCount || 0,
          totalCampaigns: campaignsCount || 0,
          totalRedemptions: redemptionsCount || 0,
          totalSavings: Math.round(totalSavings),
          totalRewards: rewardsCount || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">İstatistikler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          BONUX Platform genel istatistikleri ve özeti
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers.toLocaleString('tr-TR')}
          description="Kayıtlı kullanıcı sayısı"
          icon={Users}
        />

        <StatsCard
          title="Toplam İşletme"
          value={stats.totalBusinesses.toLocaleString('tr-TR')}
          description="Kayıtlı işletme sayısı"
          icon={Store}
        />

        <StatsCard
          title="Aktif Kampanya"
          value={stats.totalCampaigns.toLocaleString('tr-TR')}
          description="Şu anda aktif kampanyalar"
          icon={Tag}
        />

        <StatsCard
          title="Toplam Kullanım"
          value={stats.totalRedemptions.toLocaleString('tr-TR')}
          description="Kampanya kullanım sayısı"
          icon={QrCode}
        />

        <StatsCard
          title="Toplam Tasarruf"
          value={`₺${stats.totalSavings.toLocaleString('tr-TR')}`}
          description="Kullanıcıların kazandığı toplam tasarruf"
          icon={TrendingUp}
        />

        <StatsCard
          title="Ödül Kullanımı"
          value={stats.totalRewards.toLocaleString('tr-TR')}
          description="Kullanılan ödül sayısı"
          icon={Gift}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Placeholder for charts */}
        <div className="col-span-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-semibold mb-4">Son 30 Gün Trend</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Grafik yakında eklenecek
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-semibold mb-4">Segment Dağılımı</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Grafik yakında eklenecek
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
