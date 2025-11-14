import { Badge } from '@/components/ui/badge'
import type { BusinessCategory } from '@/lib/supabase/types'

interface CategoryBadgeProps {
  category: BusinessCategory
}

const categoryConfig: Record<BusinessCategory, { label: string }> = {
  cafe: { label: 'Kafe' },
  restaurant: { label: 'Restoran' },
  retail: { label: 'Perakende' },
  service: { label: 'Hizmet' },
  health: { label: 'Sağlık' },
  entertainment: { label: 'Eğlence' },
  other: { label: 'Diğer' },
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category] || categoryConfig.other

  return (
    <Badge variant="outline" className="font-medium">
      {config.label}
    </Badge>
  )
}
