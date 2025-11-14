import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface UserStatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  success: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  danger: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
}

export function UserStatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
}: UserStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
