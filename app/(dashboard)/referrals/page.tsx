'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Award } from 'lucide-react'

export default function ReferralsPage() {
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await (supabase.from('referrals') as any).select(`
        *,
        referrer:users!referrals_referrer_id_fkey(full_name, email),
        referred:users!referrals_referred_id_fkey(full_name, email)
      `).order('created_at', { ascending: false })
      return data || []
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div></div>
  }

  const activeReferrals = referrals.filter((r: any) => r.status === 'active')
  const rewardedReferrals = referrals.filter((r: any) => r.status === 'rewarded')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referans Sistemi</h1>
        <p className="text-gray-500 mt-2">Kullanıcı referanslarını görüntüleyin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Referans</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{referrals.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Referans</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeReferrals.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ödüllendirildi</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{rewardedReferrals.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Referans Listesi</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referrals.map((referral: any) => (
              <div key={referral.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{referral.referrer?.full_name}</p>
                  <p className="text-sm text-gray-600">→ {referral.referred?.full_name}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    referral.status === 'rewarded' ? 'bg-green-100 text-green-800' :
                    referral.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {referral.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{new Date(referral.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
