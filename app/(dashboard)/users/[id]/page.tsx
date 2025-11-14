'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import {
  useUserDetail,
  useUserCampaignRedemptions,
  useUserRewardRedemptions,
} from '@/hooks/use-user-detail'
import { UserStatsCard } from '@/components/users/user-stats-card'
import { SegmentBadge } from '@/components/users/segment-badge'
import { PointManagementDialog } from '@/components/users/point-management-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  Gift,
  Users,
  Calendar,
  Mail,
  Phone,
  Award,
  Tag,
  Edit,
  PlusCircle,
  MinusCircle,
} from 'lucide-react'

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [pointDialogOpen, setPointDialogOpen] = useState(false)

  const { data: user, isLoading: userLoading } = useUserDetail(userId)
  const { data: campaignRedemptions = [], isLoading: campaignsLoading } =
    useUserCampaignRedemptions(userId)
  const { data: rewardRedemptions = [], isLoading: rewardsLoading } =
    useUserRewardRedemptions(userId)

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Kullanıcı bulunamadı</p>
          <Button onClick={() => router.push('/users')} className="mt-4">
            Kullanıcı Listesine Dön
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {user.full_name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Kullanıcı Detayları
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button variant="outline" onClick={() => setPointDialogOpen(true)}>
            <Coins className="h-4 w-4 mr-2" />
            Puan Yönet
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Genel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">E-posta</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Telefon</p>
                <p className="font-medium">{user.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Segment</p>
                <div className="mt-1">
                  <SegmentBadge segment={user.segment} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kayıt Tarihi</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Referans Kodu</p>
                <p className="font-medium font-mono">{user.referral_code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Doğum Tarihi</p>
                <p className="font-medium">
                  {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString('tr-TR')
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Son Aktivite</p>
                <p className="font-medium">
                  {user.last_active_at
                    ? new Date(user.last_active_at).toLocaleDateString('tr-TR')
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Günlük Streak</p>
                <p className="font-medium">{user.daily_streak || 0} gün</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserStatsCard
          title="Toplam Puan"
          value={(user.total_points || 0).toLocaleString('tr-TR')}
          description="Kazanılan toplam puan"
          icon={Coins}
          variant="default"
        />
        <UserStatsCard
          title="Kullanılabilir Puan"
          value={(user.available_points || 0).toLocaleString('tr-TR')}
          description="Harcamaya hazır puan"
          icon={Coins}
          variant="success"
        />
        <UserStatsCard
          title="Harcanan Puan"
          value={(user.spent_points || 0).toLocaleString('tr-TR')}
          description="Ödül için kullanılan"
          icon={Gift}
          variant="warning"
        />
        <UserStatsCard
          title="Toplam Tasarruf"
          value={`₺${(user.total_savings || 0).toLocaleString('tr-TR')}`}
          description="Kampanyalardan kazanç"
          icon={TrendingUp}
          variant="success"
        />
        <UserStatsCard
          title="Segment Puanı"
          value={(user.segment_points || 0).toLocaleString('tr-TR')}
          description="Mevcut segment puanı"
          icon={Award}
          variant="default"
        />
        <UserStatsCard
          title="Referanslar"
          value={(user.referral_count || 0).toLocaleString('tr-TR')}
          description="Davet edilen kullanıcı"
          icon={Users}
          variant="default"
        />
        <UserStatsCard
          title="Kampanya Kullanımı"
          value={campaignRedemptions.length.toLocaleString('tr-TR')}
          description="Kullanılan kampanya"
          icon={Tag}
          variant="default"
        />
        <UserStatsCard
          title="Ödül Kullanımı"
          value={rewardRedemptions.length.toLocaleString('tr-TR')}
          description="Kullanılan ödül"
          icon={Gift}
          variant="default"
        />
      </div>

      {/* Activity Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivite Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns">
            <TabsList>
              <TabsTrigger value="campaigns">Kampanya Kullanımları</TabsTrigger>
              <TabsTrigger value="rewards">Ödül Kullanımları</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              {campaignsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
              ) : campaignRedemptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Henüz kampanya kullanımı bulunmuyor
                </div>
              ) : (
                <div className="space-y-3">
                  {campaignRedemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{redemption.campaigns.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {redemption.campaigns.business_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          ₺{redemption.discount_amount.toLocaleString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(redemption.redeemed_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              {rewardsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
              ) : rewardRedemptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Henüz ödül kullanımı bulunmuyor
                </div>
              ) : (
                <div className="space-y-3">
                  {rewardRedemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{redemption.rewards.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {redemption.points_spent.toLocaleString('tr-TR')} puan
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(redemption.claimed_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Point Management Dialog */}
      <PointManagementDialog
        userId={userId}
        userName={user.full_name || 'Kullanıcı'}
        currentPoints={user.available_points || 0}
        open={pointDialogOpen}
        onOpenChange={setPointDialogOpen}
      />
    </div>
  )
}
