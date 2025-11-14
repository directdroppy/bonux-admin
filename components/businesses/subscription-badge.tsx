import { Badge } from '@/components/ui/badge'
import type { SubscriptionTier } from '@/lib/supabase/types'

interface SubscriptionBadgeProps {
  tier: SubscriptionTier
}

const tierConfig: Record<SubscriptionTier, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  free: { label: 'Ücretsiz', variant: 'outline' },
  basic: { label: 'Temel', variant: 'secondary' },
  premium: { label: 'Premium', variant: 'default' },
  enterprise: { label: 'Enterprise', variant: 'destructive' },
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  const config = tierConfig[tier] || tierConfig.free

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  )
}
