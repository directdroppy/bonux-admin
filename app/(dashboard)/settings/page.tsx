'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Users, Shield, Plus } from 'lucide-react'

export default function SettingsPage() {
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await (supabase.from('admin_users') as any).select('*').order('created_at', { ascending: false })
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
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="text-gray-500 mt-2">Sistem ayarları ve admin kullanıcı yönetimi</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Yeni Admin</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Admin</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{admins.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Admin</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{admins.filter((a: any) => a.is_active).length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Süper Admin</CardTitle>
            <Settings className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{admins.filter((a: any) => a.role === 'super_admin').length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Admin Kullanıcılar</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin: any) => (
              <div key={admin.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{admin.full_name}</p>
                    {admin.is_active ? (
                      <Badge className="bg-green-600">Aktif</Badge>
                    ) : (
                      <Badge variant="outline">Pasif</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{admin.role}</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {admin.last_login ? new Date(admin.last_login).toLocaleDateString('tr-TR') : 'Giriş yok'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Genel Ayarlar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Platform Durumu</p>
              <p className="text-sm text-gray-600">Platformun genel durumu</p>
            </div>
            <Badge className="bg-green-600">Aktif</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Bakım Modu</p>
              <p className="text-sm text-gray-600">Bakım modunu aktif/pasif yapın</p>
            </div>
            <Button variant="outline" size="sm">Düzenle</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">E-posta Bildirimleri</p>
              <p className="text-sm text-gray-600">Sistem e-posta ayarları</p>
            </div>
            <Button variant="outline" size="sm">Ayarla</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
