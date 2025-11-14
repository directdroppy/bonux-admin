import { Badge } from '@/components/ui/badge'
import type { UserSegment } from '@/lib/supabase/types'

interface SegmentBadgeProps {
  segment: UserSegment
}

const segmentConfig: Record<UserSegment, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Yeni', variant: 'outline' },
  elite: { label: 'Elite', variant: 'secondary' },
  premium: { label: 'Premium', variant: 'default' },
  premium_plus: { label: 'Premium+', variant: 'destructive' },
}

export function SegmentBadge({ segment }: SegmentBadgeProps) {
  const config = segmentConfig[segment] || segmentConfig.new

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  )
}
