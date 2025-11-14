'use client'

import { useState } from 'react'
import { useBusinesses, type BusinessFilter } from '@/hooks/use-businesses'
import { BusinessTable } from '@/components/businesses/business-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function BusinessesPage() {
  const [filters, setFilters] = useState<BusinessFilter>({})
  const { data: businesses = [], isLoading } = useBusinesses(filters)

  const activeBusinesses = businesses.filter(b => b.is_active).length
  const totalCampaigns = businesses.reduce((sum, b) => sum + b.total_campaigns, 0)
  const totalRedemptions = businesses.reduce((sum, b) => sum + b.total_redemptions, 0)
  const premiumBusinesses = businesses.filter(b => b.subscription_plan === 'premium' || b.subscription_plan === 'enterprise').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            İşletme Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Tüm işletmeleri görüntüleyin ve yönetin
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yeni İşletme
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam İşletme</div>
          <div className="text-2xl font-bold mt-1">{businesses.length.toLocaleString('tr-TR')}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Aktif İşletme</div>
          <div className="text-2xl font-bold mt-1">
            {activeBusinesses.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Premium+ İşletme</div>
          <div className="text-2xl font-bold mt-1">
            {premiumBusinesses.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Kampanya</div>
          <div className="text-2xl font-bold mt-1">
            {totalCampaigns.toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Business Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <BusinessTable data={businesses} isLoading={isLoading} />
      </div>
    </div>
  )
}
