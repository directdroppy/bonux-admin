'use client'

import { useRouter, useParams } from 'next/navigation'
import { useCampaignDetail, useCampaignRedemptions } from '@/hooks/use-campaign-detail'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryBadge } from '@/components/businesses/category-badge'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Tag,
  Users,
  TrendingUp,
  Percent,
  Edit,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
} from 'lucide-react'

const campaignTypeLabels: Record<string, string> = {
  percentage_discount: 'Yüzdelik İndirim',
  fixed_discount: 'Sabit İndirim',
  buy_x_get_y: 'Al-Kazan',
  points_multiplier: 'Puan Çarpanı',
  free_product: 'Bedava Ürün',
  flash_sale: 'Flaş İndirim',
  group_deal: 'Grup İndirimi',
  birthday_special: 'Doğum Günü Özel',
  first_purchase: 'İlk Alışveriş',
  win_back: 'Geri Kazanım',
  dopamin_wave: 'Dopamin Dalgası',
  stamp_card: 'Damga Kartı',
}

export default function CampaignDetailPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const { data: campaign, isLoading: campaignLoading } = useCampaignDetail(campaignId)
  const { data: redemptions = [], isLoading: redemptionsLoading } = useCampaignRedemptions(campaignId)

  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kampanya bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Kampanya bulunamadı</p>
          <Button onClick={() => router.push('/campaigns')} className="mt-4">
            Kampanya Listesine Dön
          </Button>
        </div>
      </div>
    )
  }

  const totalDiscountAmount = redemptions.reduce((sum, r) => sum + (r.discount_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/campaigns')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {campaign.title}
              </h1>
              {campaign.is_active ? (
                <Badge className="bg-green-600">Aktif</Badge>
              ) : (
                <Badge variant="outline">Pasif</Badge>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Kampanya Detayları
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button variant={campaign.is_active ? 'destructive' : 'default'}>
            {campaign.is_active ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Deaktif Et
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aktif Et
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            İşletme Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">İşletme Adı</p>
                <p className="font-medium">{campaign.business_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
                <div className="mt-1">
                  <CategoryBadge category={campaign.category as any} />
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/businesses/${campaign.business_id}`)}
            className="mt-4"
          >
            İşletme Detayına Git →
          </Button>
        </CardContent>
      </Card>

      {/* Campaign Info */}
      <Card>
        <CardHeader>
          <CardTitle>Kampanya Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kampanya Tipi</p>
                <p className="font-medium">{campaignTypeLabels[campaign.campaign_type] || campaign.campaign_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Percent className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">İndirim Değeri</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  %{campaign.discount_value}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Başlangıç</p>
                <p className="font-medium">
                  {new Date(campaign.start_date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bitiş</p>
                <p className="font-medium">
                  {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('tr-TR') : 'Süresiz'}
                </p>
              </div>
            </div>
          </div>

          {campaign.description && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Açıklama</p>
              <p className="text-gray-900 dark:text-gray-100">{campaign.description}</p>
            </div>
          )}

          {campaign.terms_and_conditions && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Şartlar ve Koşullar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.terms_and_conditions}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 grid gap-4 md:grid-cols-3">
            {campaign.min_purchase_amount && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Min. Alışveriş</p>
                <p className="font-medium">₺{campaign.min_purchase_amount.toLocaleString('tr-TR')}</p>
              </div>
            )}
            {campaign.max_discount_amount && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maks. İndirim</p>
                <p className="font-medium">₺{campaign.max_discount_amount.toLocaleString('tr-TR')}</p>
              </div>
            )}
            {campaign.max_redemptions_per_user && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kişi Başı Kullanım</p>
                <p className="font-medium">{campaign.max_redemptions_per_user} kez</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanım</CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.total_redemptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 50 Kullanım</CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{redemptions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İndirim</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₺{totalDiscountAmount.toLocaleString('tr-TR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ort. İndirim</CardTitle>
            <Percent className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {redemptions.length > 0
                ? `₺${Math.round(totalDiscountAmount / redemptions.length).toLocaleString('tr-TR')}`
                : '₺0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redemptions */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanım Geçmişi (Son 50)</CardTitle>
        </CardHeader>
        <CardContent>
          {redemptionsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : redemptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Henüz kullanım bulunmuyor
            </div>
          ) : (
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium">{redemption.user_full_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {redemption.user_email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      ₺{(redemption.discount_amount || 0).toLocaleString('tr-TR')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(redemption.redeemed_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
