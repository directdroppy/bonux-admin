'use client'

import { useUsers } from '@/hooks/use-users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Award } from 'lucide-react'
import type { UserSegment } from '@/lib/supabase/types'

const segmentInfo: Record<UserSegment, { label: string; color: string; minPoints: number }> = {
  new: { label: 'Yeni', color: '#94a3b8', minPoints: 0 },
  elite: { label: 'Elite', color: '#60a5fa', minPoints: 500 },
  premium: { label: 'Premium', color: '#f59e0b', minPoints: 2000 },
  premium_plus: { label: 'Premium+', color: '#8b5cf6', minPoints: 5000 },
}

export default function SegmentAnalysisPage() {
  const { data: users = [], isLoading } = useUsers()

  const segmentStats = users.reduce((acc, user) => {
    acc[user.segment] = (acc[user.segment] || 0) + 1
    return acc
  }, {} as Record<UserSegment, number>)

  const totalUsers = users.length
  const totalPoints = users.reduce((sum, user) => sum + user.total_points, 0)
  const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Segment analizi yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Segment Analizi
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Kullanıcı segmentlerinin detaylı dağılımı ve analizi
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString('tr-TR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Puan</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString('tr-TR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Puan</CardTitle>
            <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPoints.toLocaleString('tr-TR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Segment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Dağılımı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(segmentInfo).map(([segment, info]) => {
            const count = segmentStats[segment as UserSegment] || 0
            const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0

            return (
              <div key={segment} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <div>
                      <p className="font-medium">{info.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {info.minPoints.toLocaleString('tr-TR')}+ puan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{count.toLocaleString('tr-TR')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      %{percentage.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Segment Details */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(segmentInfo).map(([segment, info]) => {
          const segmentUsers = users.filter((u) => u.segment === segment)
          const count = segmentUsers.length
          const totalSegmentPoints = segmentUsers.reduce((sum, u) => sum + u.total_points, 0)
          const avgSegmentPoints = count > 0 ? Math.round(totalSegmentPoints / count) : 0
          const totalSavings = segmentUsers.reduce((sum, u) => sum + u.total_savings, 0)

          return (
            <Card key={segment}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                  {info.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kullanıcı Sayısı</p>
                  <p className="text-xl font-bold">{count.toLocaleString('tr-TR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Puan</p>
                  <p className="text-xl font-bold">{avgSegmentPoints.toLocaleString('tr-TR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Tasarruf</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₺{totalSavings.toLocaleString('tr-TR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Önemli Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-blue-600 dark:text-blue-400">ℹ️</div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                En Büyük Segment
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {Object.entries(segmentStats).reduce((max, [seg, count]) =>
                  count > (segmentStats[max as UserSegment] || 0) ? seg : max,
                  'new'
                )} segmenti {Math.max(...Object.values(segmentStats), 0)} kullanıcı ile en kalabalık
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-green-600 dark:text-green-400">✓</div>
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Premium Kullanıcılar
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {((segmentStats.premium || 0) + (segmentStats.premium_plus || 0)).toLocaleString('tr-TR')} kullanıcı Premium+ segmentinde
                (%{totalUsers > 0 ? (((segmentStats.premium || 0) + (segmentStats.premium_plus || 0)) / totalUsers * 100).toFixed(1) : 0})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
