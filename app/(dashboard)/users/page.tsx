'use client'

import { useState } from 'react'
import { useUsers, type UserFilter } from '@/hooks/use-users'
import { UserTable } from '@/components/users/user-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilter>({})
  const { data: users = [], isLoading } = useUsers(filters)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Tüm kullanıcıları görüntüleyin ve yönetin
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Manuel Kullanıcı Ekle
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Kullanıcı</div>
          <div className="text-2xl font-bold mt-1">{users.length.toLocaleString('tr-TR')}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Yeni</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.segment === 'new').length.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Elite</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.segment === 'elite').length.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Premium+</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.segment === 'premium' || u.segment === 'premium_plus').length.toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <UserTable data={users} isLoading={isLoading} />
      </div>
    </div>
  )
}
