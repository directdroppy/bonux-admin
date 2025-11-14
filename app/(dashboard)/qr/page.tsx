'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, TrendingUp, Calendar } from 'lucide-react'

export default function QRPage() {
  const { data: qrScans = [], isLoading } = useQuery({
    queryKey: ['qr-scans'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await (supabase.from('campaign_redemptions_with_users') as any).select(`
        *,
        campaigns(title, business_name)
      `).order('redeemed_at', { ascending: false }).limit(100)
      return data || []
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div></div>
  }

  const today = new Date().toDateString()
  const todayScans = qrScans.filter((s: any) => new Date(s.redeemed_at).toDateString() === today)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">QR Tarama Yönetimi</h1>
        <p className="text-gray-500 mt-2">QR kod taramalarını görüntüleyin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Tarama</CardTitle>
            <QrCode className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{qrScans.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Tarama</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{todayScans.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Günlük Ortalama</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{Math.round(qrScans.length / 30)}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Son Taramalar</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qrScans.slice(0, 20).map((scan: any) => (
              <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{scan.user_full_name}</p>
                  <p className="text-sm text-gray-600">{scan.campaigns?.title} - {scan.campaigns?.business_name}</p>
                  <p className="text-xs text-green-600 font-medium">₺{(scan.discount_amount || 0).toLocaleString('tr-TR')} tasarruf</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{new Date(scan.redeemed_at).toLocaleString('tr-TR')}</p>
                  {scan.platform_loyalty_step && (
                    <p className="text-xs text-blue-600 mt-1">🎁 Adım {scan.platform_loyalty_step}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
