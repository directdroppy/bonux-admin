'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCampaigns, type CampaignFilter } from '@/hooks/use-campaigns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Tag, TrendingUp, Users, CheckCircle } from 'lucide-react'

export default function CampaignsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<CampaignFilter>({})
  const [searchTerm, setSearchTerm] = useState('')

  const { data: campaigns = [], isLoading, error } = useCampaigns(filters)

  const activeCampaigns = campaigns.filter(c => c.is_active).length
  const totalRedemptions = campaigns.reduce((sum, c) => sum + (c.total_redemptions || 0), 0)

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kampanyalar yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-bold">Hata: Kampanyalar yüklenemedi</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{(error as Error).message}</p>
          <p className="mt-4 text-sm text-gray-500">Browser console'u kontrol edin (F12)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Kampanya Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Tüm kampanyaları görüntüleyin ve yönetin
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kampanya
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kampanya</CardTitle>
            <Tag className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kampanya</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanım</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRedemptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ort. Kullanım</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 ? Math.round(totalRedemptions / campaigns.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Kampanya ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Ara</Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/campaigns/${campaign.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                {campaign.is_active ? (
                  <Badge className="bg-green-600">Aktif</Badge>
                ) : (
                  <Badge variant="outline">Pasif</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {campaign.business_name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">İndirim</span>
                  <span className="font-medium">%{campaign.discount_value || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Kullanım</span>
                  <span className="font-medium">{campaign.total_redemptions || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Başlangıç</span>
                  <span className="font-medium">
                    {new Date(campaign.start_date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Henüz kampanya bulunmuyor</p>
        </div>
      )}
    </div>
  )
}
