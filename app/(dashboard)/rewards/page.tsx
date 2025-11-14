'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, Plus, Package, TrendingUp } from 'lucide-react'

export default function RewardsPage() {
  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await (supabase.from('reward_products') as any).select('*').order('created_at', { ascending: false })
      return data || []
    },
  })

  const { data: redemptions = [] } = useQuery({
    queryKey: ['reward-redemptions'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await (supabase.from('reward_redemptions') as any).select('*')
      return data || []
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ödül Yönetimi</h1>
          <p className="text-gray-500 mt-2">Ödül ürünlerini görüntüleyin ve yönetin</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Yeni Ödül</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ödül</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{rewards.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanılan Ödül</CardTitle>
            <Gift className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{redemptions.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Puan</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{redemptions.reduce((sum: number, r: any) => sum + (r.points_spent || 0), 0)}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {rewards.map((reward: any) => (
          <Card key={reward.id}>
            <CardHeader><CardTitle>{reward.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">{reward.description || 'Açıklama yok'}</p>
              <div className="flex justify-between text-sm">
                <span>Puan:</span>
                <span className="font-bold">{reward.points_required}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Stok:</span>
                <span className="font-bold">{reward.stock === -1 ? 'Sınırsız' : reward.stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
