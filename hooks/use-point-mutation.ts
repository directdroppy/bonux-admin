import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdjustPointsParams {
  userId: string
  points: number
  type: 'add' | 'subtract'
  reason: string
}

export function useAdjustPoints() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, points, type, reason }: AdjustPointsParams) => {
      const supabase = createClient()

      // Get current user points
      const { data: user, error: fetchError } = await (supabase
        .from('users') as any)
        .select('available_points, total_points')
        .eq('id', userId)
        .single()

      if (fetchError) {
        throw new Error('Kullanıcı bilgileri alınamadı')
      }

      // Calculate new points
      const currentAvailable = user.available_points || 0
      const currentTotal = user.total_points || 0

      let newAvailable: number
      let newTotal: number

      if (type === 'add') {
        newAvailable = currentAvailable + points
        newTotal = currentTotal + points
      } else {
        newAvailable = Math.max(0, currentAvailable - points)
        newTotal = currentTotal // Don't subtract from total, only from available
      }

      // Update user points
      const { error: updateError } = await (supabase
        .from('users') as any)
        .update({
          available_points: newAvailable,
          total_points: newTotal,
        })
        .eq('id', userId)

      if (updateError) {
        throw new Error('Puanlar güncellenemedi')
      }

      // Log the action (you can create a separate table for audit logs)
      // For now, we'll just return success

      return { newAvailable, newTotal, type, points, reason }
    },
    onSuccess: (data, variables) => {
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-detail', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })

      const actionText = variables.type === 'add' ? 'eklendi' : 'çıkarıldı'
      toast.success(`${variables.points} puan başarıyla ${actionText}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bir hata oluştu')
    },
  })
}
