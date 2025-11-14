'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Store,
  Tag,
  Gift,
  Heart,
  QrCode,
  BarChart3,
  Settings,
  UserCircle,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kullanıcılar', href: '/users', icon: Users },
  { name: 'İşletmeler', href: '/businesses', icon: Store },
  { name: 'Kampanyalar', href: '/campaigns', icon: Tag },
  { name: 'Platform Sadakat', href: '/loyalty', icon: Heart },
  { name: 'Ödüller', href: '/rewards', icon: Gift },
  { name: 'Referanslar', href: '/referrals', icon: UserCircle },
  { name: 'QR Yönetimi', href: '/qr', icon: QrCode },
  { name: 'Analitik', href: '/analytics', icon: BarChart3 },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-6">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          BONUX
        </h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
